let targetHumanId = null; // Variable globale pour stocker l'ID de l'humain cible

// game loop
while (true) {
    let inputs = readline().split(' ');
    const x = parseInt(inputs[0]);
    const y = parseInt(inputs[1]);
    const humanCount = parseInt(readline());
    let humans = [];
    for (let i = 0; i < humanCount; i++) {
        inputs = readline().split(' ');
        humans.push({ id: parseInt(inputs[0]), x: parseInt(inputs[1]), y: parseInt(inputs[2]), saved: false });
    }
    const zombieCount = parseInt(readline());
    let zombies = [];
    for (let i = 0; i < zombieCount; i++) {
        inputs = readline().split(' ');
        zombies.push({
            id: parseInt(inputs[0]),
            x: parseInt(inputs[1]),
            y: parseInt(inputs[2]),
            xNext: parseInt(inputs[3]),
            yNext: parseInt(inputs[4])
        });
    }

    const playerSpeed = 1000;
    const zombieSpeed = 400;

    humans = humans.map(human => {
        const distanceToPlayer = Math.sqrt(Math.pow(human.x - x, 2) + Math.pow(human.y - y, 2));
        const turnsForPlayer = Math.ceil(distanceToPlayer / playerSpeed);

        const closestZombie = zombies.reduce((closest, zombie) => {
            const distanceToZombie = Math.sqrt(Math.pow(human.x - zombie.x, 2) + Math.pow(human.y - zombie.y, 2));
            const turnsForZombie = Math.ceil(distanceToZombie / zombieSpeed);
            return turnsForZombie < closest.turnsForZombie ? { zombie, distanceToZombie, turnsForZombie } : closest;
        }, { zombie: null, distanceToZombie: Infinity, turnsForZombie: Infinity });

        return { ...human, turnsForPlayer, turnsForZombie: closestZombie.turnsForZombie };
    });

    let targetHuman;
    if (targetHumanId !== null) {
        targetHuman = humans.find(h => h.id === targetHumanId && !h.saved);
    }

    if (!targetHuman) {
        let savableHumans = humans.filter(h => h.turnsForPlayer < h.turnsForZombie && !h.saved);
        targetHuman = savableHumans.reduce((target, h) => h.turnsForPlayer < target.turnsForPlayer ? h : target, { turnsForPlayer: Infinity });

        if (targetHuman.turnsForPlayer === Infinity) {
            // Choisir un humain au hasard si aucun n'est sauvable
            targetHuman = humans.reduce((closest, h) => {
                const distanceToPlayer = Math.sqrt(Math.pow(h.x - x, 2) + Math.pow(h.y - y, 2));
                return distanceToPlayer < closest.distanceToPlayer ? { ...h, distanceToPlayer } : closest;
            }, { distanceToPlayer: Infinity });
            targetHumanId = targetHuman.id; // Mémoriser l'ID de l'humain cible
        }
    }

    // Calculer la position stratégique pour maximiser les combos
    let bestCombo = { x: 0, y: 0, count: 0 };
    zombies.forEach(zombie => {
        let comboCount = zombies.filter(z => {
            const distance = Math.sqrt(Math.pow(z.x - zombie.x, 2) + Math.pow(z.y - zombie.y, 2));
            return distance <= 1000; // Rayon d'effet de l'attaque d'Ash
        }).length;

        if (comboCount > bestCombo.count) {
            bestCombo = { x: zombie.xNext, y: zombie.yNext, count: comboCount };
        }
    });

    // Vérifier si un humain est en danger immédiat
    let imminentDanger = humans.find(human => {
        return zombies.some(zombie => {
            const distanceToZombie = Math.sqrt(Math.pow(human.x - zombie.x, 2) + Math.pow(human.y - zombie.y, 2));
            const turnsForZombie = Math.ceil(distanceToZombie / zombieSpeed);
            return turnsForZombie < human.turnsForPlayer && !human.saved;
        });
    });

    // Si un humain est en danger immédiat, se déplacer vers lui
    if (imminentDanger) {
        // Vérifier si l'humain en danger immédiat est sauvable
        if (imminentDanger.turnsForPlayer < imminentDanger.turnsForZombie) {
            console.log(`${Math.round(imminentDanger.x)} ${Math.round(imminentDanger.y)}`);
            imminentDanger.saved = true; // Marquer l'humain comme sauvé
        } else {
            // Si l'humain en danger immédiat n'est pas sauvable, chercher un autre humain sauvable
            let otherSavableHuman = humans.find(h => h.turnsForPlayer < h.turnsForZombie && h.id !== imminentDanger.id && !h.saved);
            if (otherSavableHuman) {
                console.log(`${Math.round(otherSavableHuman.x)} ${Math.round(otherSavableHuman.y)}`);
                otherSavableHuman.saved = true; // Marquer l'humain comme sauvé
            } else if (bestCombo.count > 1) {
                // Si un combo est possible, se déplacer vers la position du combo
                console.log(`${Math.round(bestCombo.x)} ${Math.round(bestCombo.y)}`);
            } else {
                // Sinon, se déplacer vers l'humain cible
                console.log(`${Math.round(targetHuman.x)} ${Math.round(targetHuman.y)}`);
            }
        }
    } else if (bestCombo.count > 1) {
        // Si un combo est possible, se déplacer vers la position du combo
        console.log(`${Math.round(bestCombo.x)} ${Math.round(bestCombo.y)}`);
    } else {
        // Sinon, se déplacer vers l'humain cible
        console.log(`${Math.round(targetHuman.x)} ${Math.round(targetHuman.y)}`);
    }
}