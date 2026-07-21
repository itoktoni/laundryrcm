import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import crypto from 'crypto';

export const GET = () => json({ status: 'ok', url: '/api/webhook/schedule', method: 'POST' });

// ─── Templates ───────────────────────────────────────────────────────────────
const TEMPLATES = {
  overdue_pickup: (data) =>
    `📦 Lewat Ambil\n\nHalo ${data.customerName}! 👋\nPesanan *${data.orderId}* sudah selesai tapi belum diambil ${data.days} hari.\n\nMohon segera diambil ya! 🙏`,

  inactive_customer: (data) =>
    `💜 Kangen Nih!\n\nHalo ${data.customerName}! 👋\nSudah ${data.days} hari sejak terakhir kali cuci di laundry kami.\n\nYuk cuci lagi sekarang! 🧺✨`,

  low_stock: (data) =>
    `⚠️ Stok Habis\n\n*${data.itemName}* sudah habis!\nSisa: ${data.remaining} ${data.unit}\n\nSegera restock! 🛒`,

  machine_service: (data) =>
    `🔧 Service Mesin\n\nMesin *${data.machineName}* sudah waktunya service!\nTerakhir service: ${data.lastService || 'belum pernah'}\n\nJangan lupa di-maintenance! 🔩`,

  ready_delivery: (data) =>
    `✅ Pesanan Siap!\n\nHalo ${data.customerName}! 👋\nPesanan *${data.orderId}* sudah selesai.\n\n${data.isDelivery ? 'Kurir akan segera menghubungi Anda.' : 'Silakan datang ke toko untuk ambil.'} Terima kasih! 🙏`
};

// ─── Checkers (SQL matches actual schema) ────────────────────────────────────

async function checkOverduePickup() {
  const results = [];
  try {
    const { rows: orders } = await db.execute(`
      SELECT o.order_id,
             c.customer_name,
             c.customer_phone,
             o.order_created_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.order_status = 'selesai'
        AND o.order_payment_status = 'paid'
        AND julianday('now') - julianday(o.order_created_at) >= 3
        AND c.customer_phone IS NOT NULL
        AND c.customer_phone != ''
    `);

    for (const o of orders) {
      const diffMs = Date.now() - new Date(o.order_created_at).getTime();
      const days = Math.floor(diffMs / 86400000);
      results.push({
        phone: o.customer_phone,
        message: TEMPLATES.overdue_pickup({
          customerName: o.customer_name || 'Pelanggan',
          orderId: o.order_id.slice(-6),
          days
        }),
        refType: 'order',
        refId: o.order_id
      });
    }
  } catch (e) {
    console.error('[schedule] overdue_pickup error:', e.message);
  }
  return results;
}

async function checkInactiveCustomer() {
  const results = [];
  try {
    const { rows: customers } = await db.execute(`
      SELECT c.customer_id, c.customer_name, c.customer_phone,
             MAX(o.order_created_at) AS last_order
      FROM customers c
      INNER JOIN orders o ON c.customer_id = o.customer_id
      WHERE c.customer_phone IS NOT NULL
        AND c.customer_phone != ''
      GROUP BY c.customer_id
      HAVING julianday('now') - julianday(MAX(o.order_created_at)) >= 7
    `);

    for (const c of customers) {
      const diffMs = Date.now() - new Date(c.last_order).getTime();
      const days = Math.floor(diffMs / 86400000);
      results.push({
        phone: c.customer_phone,
        message: TEMPLATES.inactive_customer({
          customerName: c.customer_name || 'Pelanggan',
          days
        }),
        refType: 'customer',
        refId: c.customer_id
      });
    }
  } catch (e) {
    console.error('[schedule] inactive_customer error:', e.message);
  }
  return results;
}

async function checkLowStock() {
  const results = [];
  try {
    const { rows: items } = await db.execute(`
      SELECT inventory_id, inventory_name, inventory_quantity, inventory_unit, inventory_min_stock
      FROM inventory
      WHERE inventory_quantity <= inventory_min_stock
    `);

    for (const i of items) {
      results.push({
        phone: null,
        message: TEMPLATES.low_stock({
          itemName: i.inventory_name,
          remaining: i.inventory_quantity,
          unit: i.inventory_unit
        }),
        refType: 'inventory',
        refId: i.inventory_id
      });
    }
  } catch (e) {
    console.error('[schedule] low_stock error:', e.message);
  }
  return results;
}

async function checkMachineService() {
  const results = [];
  try {
    const { rows: machines } = await db.execute(`
      SELECT machine_id, machine_name, machine_last_service, machine_next_service
      FROM machines
      WHERE machine_next_service IS NOT NULL
        AND machine_next_service <= datetime('now')
    `);

    for (const m of machines) {
      results.push({
        phone: null,
        message: TEMPLATES.machine_service({
          machineName: m.machine_name,
          lastService: m.machine_last_service
        }),
        refType: 'machine',
        refId: m.machine_id
      });
    }
  } catch (e) {
    console.error('[schedule] machine_service error:', e.message);
  }
  return results;
}

async function checkReadyDelivery() {
  const results = [];
  try {
    const { rows: orders } = await db.execute(`
      SELECT o.order_id,
             c.customer_name,
             c.customer_phone,
             o.order_notes
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.customer_id
      WHERE o.order_status = 'selesai'
        AND o.order_payment_status = 'paid'
        AND c.customer_phone IS NOT NULL
        AND c.customer_phone != ''
    `);

    for (const o of orders) {
      const isDelivery = (o.order_notes || '').toLowerCase().includes('kirim');
      results.push({
        phone: o.customer_phone,
        message: TEMPLATES.ready_delivery({
          customerName: o.customer_name || 'Pelanggan',
          orderId: o.order_id.slice(-6),
          isDelivery
        }),
        refType: 'order',
        refId: o.order_id
      });
    }
  } catch (e) {
    console.error('[schedule] ready_delivery error:', e.message);
  }
  return results;
}

// ─── Map type → checker ───────────────────────────────────────────────────────
const CHECKERS = {
  overdue_pickup: checkOverduePickup,
  inactive_customer: checkInactiveCustomer,
  low_stock: checkLowStock,
  machine_service: checkMachineService,
  ready_delivery: checkReadyDelivery
};

// ─── Ensure pending table ─────────────────────────────────────────────────────
async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS whatsapp_pending_messages (
      pending_id TEXT PRIMARY KEY,
      schedule_type TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      ref_type TEXT,
      ref_id TEXT,
      status TEXT NOT NULL DEFAULT 'queued',
      sent_at TEXT,
      error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

// ─── Send WhatsApp via wacli ──────────────────────────────────────────────────
async function sendWhatsApp(phone, message) {
  const { WACLI_PATH, WA_SESSION_NAME } = await import('$env/dynamic/private')
    .then(m => m.env)
    .catch(() => ({}));

  const wacliPath = WACLI_PATH || null;
  const sessionName = WA_SESSION_NAME || 'laundry-wa';

  if (!wacliPath) {
    console.log('[schedule] wacli not configured, skipping WhatsApp send for:', phone);
    return true;
  }

  const tempFile = `whatsapp-pending-${Date.now()}.txt`;
  const fs = await import('fs/promises');
  await fs.writeFile(tempFile, message, 'utf-8');

  try {
    const { execSync } = await import('child_process');
    const fs2 = await import('fs');
    if (!fs2.default.existsSync(wacliPath)) {
      console.log('[schedule] wacli not found at', wacliPath, '- skipping send to', phone);
      return true;
    }
    const command = `"${wacliPath}" --session "${sessionName}" send text --phone "${phone}" --file "${tempFile}"`;
    execSync(command, { timeout: 30000, stdio: 'pipe' });
    await fs.unlink(tempFile);
    return true;
  } catch (error) {
    try { await fs.unlink(tempFile); } catch {}
    throw error;
  }
}

// ─── Admin phone ──────────────────────────────────────────────────────────────
async function getAdminPhone() {
  try {
    const { rows } = await db.execute("SELECT setting_value FROM app_settings WHERE setting_key = 'store_phone' LIMIT 1");
    return rows[0]?.setting_value || null;
  } catch { return null; }
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST({ url }) {
  const startTime = Date.now();
  try {
    await ensureTable();

    const typeParam = url.searchParams.get('type') || 'all';
    const types = typeParam === 'all' ? Object.keys(CHECKERS) : [typeParam];

    const seen = new Set();
    const pendingInserts = [];

    // Collect customer messages
    for (const scheduleType of types) {
      const checker = CHECKERS[scheduleType];
      if (!checker) continue;
      const messages = await checker();
      for (const msg of messages) {
        if (!msg.phone) continue;
        const key = `${msg.phone}|${msg.message.slice(0, 50)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        pendingInserts.push(msg);
      }
    }

    // Admin alerts (inventory + machine → sent immediately)
    const adminPhone = await getAdminPhone();
    let adminAlertSent = 0;
    if (adminPhone) {
      const alerts = [];
      for (const scheduleType of types) {
        const checker = CHECKERS[scheduleType];
        if (!checker) continue;
        const messages = await checker();
        for (const msg of messages) {
          if (!msg.phone) {
            alerts.push(`⚠️ *[${scheduleType}]*\n${msg.message}`);
          }
        }
      }
      if (alerts.length > 0) {
        const fullMessage = `🔔 *LAUNDRY - Jadwal Harian*\n\n${alerts.join('\n\n')}`;
        try {
          await sendWhatsApp(adminPhone, fullMessage);
          adminAlertSent = 1;
        } catch (e) {
          console.error('[webhook/schedule] admin alert failed:', e.message);
        }
      }
    }

    // Queue customer messages
    let totalQueued = 0;
    for (const msg of pendingInserts) {
      try {
      await db.execute({
        sql: `INSERT INTO whatsapp_pending_messages (pending_id, schedule_id, schedule_type, phone, message, ref_type, ref_id, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', datetime('now'))`,
        args: [crypto.randomUUID(), crypto.randomUUID(), 'auto', msg.phone, msg.message, msg.refType || null, msg.refId || null]
      });
        totalQueued++;
      } catch (e) {
        console.error('[webhook/schedule] queue insert error:', e.message);
      }
    }

    // Send queued messages
    let totalSent = 0;
    let totalFailed = 0;
    const { rows: queuedMessages } = await db.execute(`
      SELECT pending_id, phone, message
      FROM whatsapp_pending_messages
      WHERE status = 'queued'
      ORDER BY created_at ASC
      LIMIT 10
    `);

    for (const qm of queuedMessages) {
      try {
        await sendWhatsApp(qm.phone, qm.message);
        await db.execute({
          sql: `UPDATE whatsapp_pending_messages SET status = 'sent', sent_at = datetime('now') WHERE pending_id = ?`,
          args: [qm.pending_id]
        });
        totalSent++;
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        await db.execute({
          sql: `UPDATE whatsapp_pending_messages SET status = 'failed', error = ? WHERE pending_id = ?`,
          args: [e.message?.slice(0, 255) || 'unknown', qm.pending_id]
        });
        totalFailed++;
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    return json({ success: true, queued: totalQueued, sent: totalSent, failed: totalFailed, adminAlert: adminAlertSent, elapsed: `${elapsed}s` });
  } catch (error) {
    console.error('[webhook/schedule] CRITICAL:', error.message);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}