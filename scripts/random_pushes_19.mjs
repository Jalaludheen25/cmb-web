import { execSync } from 'child_process';

// Generate 19 random intervals over 7200 seconds (~2 hours) with varied random gaps
function getRandomDelays(count, totalSeconds) {
  let raw = [];
  for (let i = 0; i < count; i++) {
    raw.push(Math.random() * 1.4 + 0.3);
  }
  let sum = raw.reduce((a, b) => a + b, 0);
  let scaled = raw.map(w => Math.round((w / sum) * totalSeconds));
  return scaled;
}

const count = 19;
const totalSeconds = 7200;
const delays = getRandomDelays(count, totalSeconds);

console.log(`=== 19 Random Pushes Scheduler Started ===`);
console.log(`Target total duration: ${totalSeconds} seconds (120 mins)`);
console.log(`Delays per push (seconds): ${delays.join(', ')}`);
console.log(`Delays per push (minutes): ${delays.map(d => (d / 60).toFixed(1)).join(', ')}`);

async function run() {
  for (let i = 0; i < count; i++) {
    const waitMs = delays[i] * 1000;
    const waitMins = (delays[i] / 60).toFixed(1);
    console.log(`\n[Push ${i + 1}/${count}] Waiting ${waitMins} min (${delays[i]}s)...`);
    
    await new Promise(res => setTimeout(res, waitMs));

    try {
      console.log(`[Push ${i + 1}/${count}] Staging changes...`);
      execSync('git add -A', { stdio: 'inherit' });
      
      const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
      if (status.length > 0) {
        console.log(`[Push ${i + 1}/${count}] Committing changes...`);
        execSync(`git commit -m "Auto update ${i + 1}/${count}"`, { stdio: 'inherit' });
      } else {
        console.log(`[Push ${i + 1}/${count}] No changes detected. Creating empty sync commit...`);
        execSync(`git commit --allow-empty -m "Scheduled push sync ${i + 1}/${count}"`, { stdio: 'inherit' });
      }
      
      console.log(`[Push ${i + 1}/${count}] Pushing to origin main...`);
      execSync('git push origin main', { stdio: 'inherit' });
      console.log(`[Push ${i + 1}/${count}] Push completed successfully!`);
    } catch (err) {
      console.error(`[Push ${i + 1}/${count}] Error during push:`, err.message);
    }
  }
  console.log('\n=== All 19 random pushes finished successfully! ===');
}

run();
