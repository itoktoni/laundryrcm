# WhatsApp Scheduling Webhook Setup

## Overview
Automated WhatsApp notifications for laundry operations via webhook triggered by external cron jobs.

## Database Tables

### `whatsapp_schedules`
Stores schedule configurations for different notification types.

**Columns:**
- `schedule_id` (TEXT PRIMARY KEY): Unique identifier
- `schedule_type` (TEXT): Type of schedule - one of:
  - `pending_pickup`: Orders ready >3 days not picked up
  - `inactive_customer`: Customers inactive >1 week
  - `low_stock`: Inventory below minimum threshold
  - `machine_service`: Machine service schedule due
  - `ready_delivery`: Orders ready for delivery (3+ days)
- `schedule_name` (TEXT): Human-readable name
- `schedule_description` (TEXT): Description of this schedule
- `schedule_enabled` (INTEGER): 1=active, 0=disabled
- `schedule_cron_expression` (TEXT): Cron expression (informational)
- `schedule_days_threshold` (INTEGER): Days threshold for some checks
- `schedule_template` (TEXT): WhatsApp message template with {{variables}}
- `schedule_last_run` (TEXT): ISO timestamp of last execution attempt
- `schedule_last_success` (TEXT): ISO timestamp of last successful run
- `schedule_last_error` (TEXT): Last error message if failed
- `schedule_created_at` (TEXT): Creation timestamp
- `schedule_updated_at` (TEXT): Last update timestamp

### `whatsapp_schedule_logs`
Execution logs for all schedule runs.

**Columns:**
- `log_id` (TEXT PRIMARY KEY): Unique log entry ID
- `schedule_id` (TEXT FOREIGN KEY): Reference to whatsapp_schedules
- `log_status` (TEXT): One of 'success', 'failed', 'partial'
- `log_message_count` (INTEGER): Number of messages sent
- `log_error` (TEXT): Error details if failed
- `log_created_at` (TEXT): Log timestamp

## Webhook Endpoint

**URL:** `POST /api/webhook/schedule`

**Headers:**
- `Authorization: Bearer {webhook_schedule_key}` OR
- `x-api-key: {webhook_schedule_key}`

The API key is stored in `app_settings` table with key `webhook_schedule_key`.

**Request Body (optional JSON):**
```json
{
  "schedule_type": "all"
}
```

- `schedule_type`: Filter by type - "all" runs all enabled schedules, or specific type name

**Response:**
```json
{
  "success": true,
  "totalSent": 42,
  "breakdown": {
    "pending_pickup": 10,
    "inactive_customer": 15,
    "low_stock": 5,
    "machine_service": 0,
    "ready_delivery": 12
  }
}
```

## Setup with cron-job.org

### Step 1: Configure API Key
1. Go to app settings in laundry-app
2. Set `webhook_schedule_key` to a secure random key
3. Copy this key

### Step 2: Create Cron Jobs on cron-job.org

#### Example 1: All Schedules (Daily)
```
URL: https://your-domain.com/api/webhook/schedule
Method: POST
Headers: 
  Authorization: Bearer YOUR_WEBHOOK_KEY
  Content-Type: application/json
Body: {"schedule_type": "all"}
Schedule: Every day at 9 AM (0 9 * * ?)
```

#### Example 2: Pending Pickup Check (3x daily)
```
URL: https://your-domain.com/api/webhook/schedule
Method: POST
Headers:
  Authorization: Bearer YOUR_WEBHOOK_KEY
  Content-Type: application/json
Body: {"schedule_type": "pending_pickup"}
Schedule: Every 8 hours (0 */8 * * ?)
```

#### Example 3: Inactive Customer Check (Weekly)
```
URL: https://your-domain.com/api/webhook/schedule
Method: POST
Headers:
  Authorization: Bearer YOUR_WEBHOOK_KEY
  Content-Type: application/json
Body: {"schedule_type": "inactive_customer"}
Schedule: Every Monday 8 AM (0 8 ? * MON)
```

#### Example 4: Low Stock Check (Daily at 7 AM)
```
URL: https://your-domain.com/api/webhook/schedule
Method: POST
Headers:
  Authorization: Bearer YOUR_WEBHOOK_KEY
  Content-Type: application/json
Body: {"schedule_type": "low_stock"}
Schedule: 0 7 * * ?
```

#### Example 5: Machine Service Check (Daily)
```
URL: https://your-domain.com/api/webhook/schedule
Method: POST
Headers:
  Authorization: Bearer YOUR_WEBHOOK_KEY
  Content-Type: application/json
Body: {"schedule_type": "machine_service"}
Schedule: 0 8 * * ?
```

## Default Schedules

Five schedules are created by default during migration:

1. **Pesanan Siap Diambil** (pending_pickup)
   - Template: "Halo {{customer_name}}, baju Anda sudah selesai dicuci. Silakan diambil di toko kami atau hubungi untuk pengiriman."

2. **Customer Tidak Aktif** (inactive_customer)
   - Template: "Halo {{customer_name}}, lama tidak ada kabar. Kami rindu dengan Anda. Hubungi kami untuk mendapatkan promo khusus!"

3. **Stok Habis** (low_stock)
   - Template: "Alert: Stok {{item_name}} telah mencapai {{current_qty}} {{unit}} (minimum: {{min_qty}} {{unit}}). Segera lakukan pemesanan."

4. **Jadwal Service Mesin** (machine_service)
   - Template: "Reminder: Mesin {{machine_name}} perlu service. Jadwal terakhir: {{last_service}}. Status: {{machine_status}}."

5. **Pesanan Siap Diantar** (ready_delivery)
   - Template: "Halo {{customer_name}}, pesanan Anda sudah siap selama 3 hari. Kami siap mengantar. Berapa alamat pengiriman Anda?"

## Template Variables

### pending_pickup & ready_delivery
- `{{customer_name}}`: Customer name
- `{{customer_phone}}`: Customer phone (added to context)
- `{{customer_address}}`: Customer address

### inactive_customer
- `{{customer_name}}`: Customer name
- `{{customer_phone}}`: Customer phone

### low_stock
- `{{item_name}}`: Inventory item name
- `{{current_qty}}`: Current quantity
- `{{min_qty}}`: Minimum threshold
- `{{unit}}`: Unit of measurement

### machine_service
- `{{machine_name}}`: Machine name
- `{{last_service}}`: Last service date
- `{{machine_status}}`: Current machine status

## Query Logic

### Pending Pickup
Orders with status "selesai" created more than 3 days ago.

### Inactive Customer
Customers with no orders (or last order) more than 1 week ago.

### Low Stock
Inventory items where `inventory_quantity < inventory_min_stock`.

### Machine Service
Machines where `machine_next_service` is today or earlier.

### Ready Delivery
Same as pending_pickup (orders "selesai" >3 days) - typically triggered separately for delivery notifications.

## Monitoring

### View Schedule Status
Query `whatsapp_schedules` to see:
- `schedule_last_run`: When it last ran
- `schedule_last_success`: When it last succeeded
- `schedule_last_error`: Last error message
- `schedule_enabled`: Is it active?

### View Execution Logs
Query `whatsapp_schedule_logs` ordered by `log_created_at DESC` to see:
- `log_status`: success/failed/partial
- `log_message_count`: How many messages sent
- `log_error`: Error details if failed

## Local Testing

### Enable Debug Mode
Set `webhook_debug = '1'` in app_settings to bypass API key check.

### Test Endpoint (with debug enabled)
```bash
curl -X POST http://localhost:5173/api/webhook/schedule \
  -H "Content-Type: application/json" \
  -d '{"schedule_type": "all"}'
```

### View Logs
Check `logs/webhook-schedule.log` for execution details.

## Notes

- WhatsApp sending is currently simulated (logs only, no real send)
- Integration point: `sendWhatsApp()` function in `/api/webhook/schedule/+server.js`
- When ready: Replace with real WhatsApp provider (Twilio, Meta, etc.)
- All timestamps in ISO format (UTC)
- All phone numbers should be in international format for production WhatsApp integration
- Admin phone for alerts: stored in app_settings as `admin_phone`