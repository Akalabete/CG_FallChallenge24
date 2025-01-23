/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/


// game loop
class City {
    constructor() {
        this.ressource= 0;
        this.buildings = [];
        this.travelRoutes = []
        this.pods = []
    }
    updateNewTradeRoute(building1, building2, capacity) {
        this.travelRoutes.find(travelRoute => travelRoute.building1 === building1 && travelRoute.building2 === building2 && travelRotue.capacity === capacity)
         ? null : this.travelRoutes.push(new TravelRoute(this.travelRoutes.length, building1, building2, capacity));

    }
    updateRessource(ressource) {
        this.ressource = ressource;
    }
    updatePod(pod) {
        this.pods.find(pod => pod.id === pod.id) ? null : this.pods.push(pod);
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
    constructor(id, type, level, x, y) {
        this.id = id;
        this.level = level;
        this.x = x;
        this.y = y;
        this.hasTR = false;
        this.hasTP = false;
        this.isDesserved = false;
    }
}
class LandingArea {
    constructor(id, x, y, monthlyArrivals, arrivingType) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.monthlyArrivals = 0;
        this.arrivingType = []
    }
}

class TravelRoute {
    constructor(id, building1, building2, capacity) {
        this.id = id;
        this.building1 = building1;
        this.building2 = building2;
        this.capacity = capacity;
        this.hasPod = false;
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
    }
    const numNewBuildings = parseInt(readline());
    for (let i = 0; i < numNewBuildings; i++) {
        const buildingProperties = readline();
    }

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    console.log('TUBE 0 1;TUBE 0 2;POD 42 0 1 0 2 0 1 0 2');     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT

}