// in dev, this makes Vite inject its client as this module's first dependency,
// so that global constant replacements are installed before any other module
// (including user hooks) evaluates. In build it's inert.
import.meta.hot;




export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~2],
		"/attendance": [~3],
		"/categories": [~4],
		"/crm": [~5],
		"/customers": [~6],
		"/customers/[id]": [~7],
		"/dashboard": [~8],
		"/finance": [~9],
		"/inventory": [~10],
		"/inventory/[id]": [~11],
		"/login": [12],
		"/logout": [13],
		"/machines": [~14],
		"/orders": [~15],
		"/orders/new": [~16],
		"/orders/[id]": [~17],
		"/products": [~18],
		"/promo": [~19],
		"/register": [20],
		"/reports_attendance": [~22],
		"/reports": [~21],
		"/schedule": [~23],
		"/settings": [25],
		"/setting": [~24],
		"/tools": [26],
		"/tools/calculator": [27],
		"/tools/calculator/harga": [28],
		"/tools/calculator/omset": [29],
		"/tools/calculator/profit": [30],
		"/tools/calculator/sdm": [31],
		"/tools/faq": [~32],
		"/tools/sop": [~33],
		"/users": [~34]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';

export const get_error_template = () => import('../shared/error-template.js').then(m => m.default);