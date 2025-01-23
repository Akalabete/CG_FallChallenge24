/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/


// game loop
class City {
    constructor() {
        this.ressource= 0;
        this.buildings = [];
        this.travelRoutes = [];,
        this.podList = []
    }
    updateNewTradeRoute(building1, building2, capacity) {
        this.travelRoutes.find(travelRoute => travelRoute.building1 === building1 && travelRoute.building2 === building2 && travelRotue.capacity === capacity)
         ? null : this.travelRoutes.push(new TravelRoute(this.travelRoutes.length, building1, building2, capacity));

    }
    updateRessource(ressource) {
        this.ressource = ressource;
    }
    updatePodList(podProperties) {
        let found = false
        this.podList.forEach((pod) => {
            pod.isActive = false
            // on cherche si il y a un pod avec le meme id que celui donné
            if (pod.id === podProperties[0]) {
                found = true;
                isActive = true;
                // update la liste des arrets si différents de celle enregistrée (destru et recréa de la route avec mem id de pod)
                if (podProperties[1] !== pod.stops || podProperties[2].split(' ') !== pod.travel) {
                    this.pod.stops = podProperties[1];
                    this.pod.travel = podProperties[2].split(' ');
                }else {
                    // sinon rien
                    return;
                }
            }
        });
        // si il n'est pas present on le crée
        if(found === false) {
            const pod = new Pod(podProperties[0], podProperties[1], podProperties[2].split(' '), true);
            this.podList.push(pod);
        }else {
            return;
        }
        // et on mets a jour la liste des pods actif ( en cas de pod detruit non remplacés)
        this.podlist = this.podList.filter(pod => pod.isActive === true)
    }       

    updateNewBuildings(numNewBuildings, buildingProperties) {
        for (let i = 0; i < numNewBuildings; i++) {
            let BPArray = buildingProperties.split(' ');
            if (BPArray[0] === 0) {
                if(BPArray[4] > 0){
                    let astroType1 = 0;
                    let astroType2 = 0;
                    let astroType3 = 0;
                    let astroType4 = 0;
                    let astroType5 = 0;
                    let astroType6 = 0;
                    for(let j = 5; j<BPArray.length; j++) {
                        switch (BPArray[j]) {
                            case 1:
                                astroType1++;
                                break;
                            case 2:
                                astroType2++;
                                break;
                            case 3:
                                astroType3++;
                                break;
                            case 4:
                                astroType4++;
                                break;
                            case 5:
                                astroType5++;
                                break;
                            case 6:
                                astroType6++;
                                break;
                            default:
                                break;
                        }
                    }
                    const landingArea = new LandingArea(
                        BPArray[1],
                        BPArray[2],
                        BPArray[3],
                        BPArray[4],
                        [astroType1, astroType2, astroType3, astroType4, astroType5, astroType6]);
                    this.buildings.push(landingArea);
                } else {
                    return;
                }
            }else {
                const building= new Building(
                    BPArray[1],
                    BPArray[0],
                    BPArray[2],
                    BPArray[3],
                    false,
                    false,
                    false
                );
            }
        }
    }
}

class Building {
    constructor(id, level, x, y, hasTR, hasTP, isDesserved) {
        this.id = id;
        this.level = level;
        this.x = x;
        this.y = y;
        this.hasTR = hasTR;
        this.hasTP = hasTP;
        this.isDesserved = isDesserved;
    }
}
class LandingArea {
    constructor(id, x, y, monthlyArrivals, arrivingType) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.monthlyArrivals = monthlyArrivals;
        this.arrivingType = arrivalType
    }
}
class Pod {
    constructor(id, stops, travel) {
        this.id = id;
        this.stops = stops;
        travel = travel.split(' ');
        this.isActive = isActive
    }
    

}
class TravelRoute {
    constructor(length, building1, building2, capacity) {
        this.length = length;
        this.building1 = building1;
        this.building2 = building2;
        this.capacity = capacity;
        this.hasTraffic = false;
    }
    updateHasTraffic(pod) {
        PPArray = pod.travel
        if (PPArray.find(pod => pod.building1 === this.building1 && pod.building2 === this.building2)){
            this.hasTraffic = true;
        }
    }

}

const city = new City();

while (true) {
    const resources = parseInt(readline());
    const numTravelRoutes = parseInt(readline());
    for (let i = 0; i < numTravelRoutes; i++) {
        var inputs = readline().split(' ');
        const buildingId1 = parseInt(inputs[0]);
        const buildingId2 = parseInt(inputs[1]);
        const capacity = parseInt(inputs[2]);
    }
    const numPods = parseInt(readline());
    
    for (let i = 0; i < numPods; i++) {
        const podProperties = readline();
        updatePodList(podProperties);
    }
    
    const numNewBuildings = parseInt(readline());
    for (let i = 0; i < numNewBuildings; i++) {
        const buildingProperties = readline();
    }

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    console.log('TUBE 0 1;TUBE 0 2;POD 42 0 1 0 2 0 1 0 2');     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT

}