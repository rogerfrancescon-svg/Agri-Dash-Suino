const fs = require('fs');

let content = fs.readFileSync('src/lib/storage.ts', 'utf8');

// Find where it sets status: 'Em andamento'
// We will replace it with a check: if the latest visit for this integrado has age > 150, it's Fechado.
// But wait, during the loop, we are building the map. We can just set them all to Fechado, and then loop through visits and set them to Em Andamento if there's a visit with idade < 150?
// Actually, it's easier to just do a second pass after collecting all visits.
