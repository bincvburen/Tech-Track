// store.js (in de root van je project)

import { writable } from 'svelte/store';

// Maak een store voor de gebruikersdata en loginstatus
export const userData = writable(null); // Houdt de gebruikersdata bij (null als niet ingelogd)
export const isLoggedIn = writable(false); // Houdt de loginstatus bij (true als ingelogd, anders false)
