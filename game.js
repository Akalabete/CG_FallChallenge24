/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/


// game loop
class City {
    constructor() {
        this.ressources= 0;
        this.buildings = [];
        this.travelRoutes = [];
        this.podList = []
    }
    updateNewTradeRoute(building1ID, building2ID, capacity) {
        const existingRoute = this.travelRoutes.find(travelRoute => 
            travelRoute.building1 === building1ID && 
            travelRoute.building2 === building2ID && 
            travelRoute.capacity === capacity
        );
    
        if (!existingRoute) {
            const newRoute = new TravelRoute(calculateLength(building1ID, building2ID), building1ID, building2ID, capacity);
            this.travelRoutes.push(newRoute);
    
            // update hasTR of buildings
            if (this.buildings[building1ID]) {
                this.buildings[building1ID].hasTR++;
            }
            if (this.buildings[building2ID]) {
                this.buildings[building2ID].hasTR++;
            } else {
                return;
            }
        }
        
    }
    updateRessources(ressources) {
        this.ressources = ressources;
    }
    updatePodList(podProperties) {
        let found = false
        this.podList.forEach((pod) => {
            pod.isActive = false
            // search pod with same ID
            if (pod.id === podProperties[0]) {
                found = true;
                isActive = true;
                // update list of stops / stops number in case of recreating the pod with same id
                if (podProperties[1] !== pod.stops || podProperties[2].split(' ') !== pod.travel) {
                    this.pod.stops = podProperties[1];
                    this.pod.travel = podProperties[2].split(' ');
                }else {
                    return;
                }
            } else {
                return;
            }
        });
        // if not present we create
        if(found === false) {
            const pod = new Pod(podProperties[0], podProperties[1], podProperties[2].split(' '), true);
            this.podList.push(pod);
        }else {
            return;
        }
        // update active pod list
        this.podlist = this.podList.filter(pod => pod.isActive === true)
    }       
    updateNewBuildings(numNewBuildings, buildingProperties) {
        for (let i = 0; i < numNewBuildings; i++) {
            // extract properties
            let BPArray = buildingProperties.split(' ');
            // verify if it is a landing area or a building
            if (BPArray[0] === 0) {
                if(BPArray[4] > 0){
                    let astroType1 = 0;
                    let astroType2 = 0;
                    let astroType3 = 0;
                    let astroType4 = 0;
                    let astroType5 = 0;
                    let astroType6 = 0;
                    // create and populate an array of astronauts types
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
                    // create and push the object in the buildings array
                    const landingArea = new LandingArea(
                        BPArray[1],
                        "landing area",
                        BPArray[2],
                        BPArray[3],
                        BPArray[4],
                        [astroType1, astroType2, astroType3, astroType4, astroType5, astroType6],
                        0,
                        false,
                    );
                    this.buildings.push(landingArea);
                } else {
                    return;
                }
                // create and push the lunar module object in the buildings array
            }else {
                const building= new Building(
                    BPArray[1],
                    "lunar module",
                    BPArray[0],
                    BPArray[2],
                    BPArray[3],
                    0,
                    false,
                    false,
                );
                this.buildings.push(building);
            }
        }
    }
}
// fn that calculate the length of the travel route
function calculateLength(building1ID, building2ID) {
    const building1 = this.buildings.find(building => building.id === building1ID);
    const building2 = this.buildings.find(building => building.id === building2ID);
    return Math.sqrt(Math.pow(building1.x - building2.x, 2) + Math.pow(building1.y - building2.y, 2));
}
// fn that verify if some points are aligned
function pointOnSegment(A, B, C) {
    epsilon = 0.0000001
    return (-epsilon < distance(B, A) + distance(A, C) - distance(B, C) < epsilon)
}
// function that find the closests buildings from 1 and give an array
function findClosestBuildingIds(buildingA) {
    const distances = city.buildings.map((building) => {
        const distance = Math.sqrt(Math.pow(buildingA.x - building.x, 2) + Math.pow(buildingA.y - building.y, 2));
        return { id: building.id, distance: distance };
    });

    distances.sort((a, b) => a.distance - b.distance);

    return distances.map((building) => building.id);
}
// fn that filters the building without connection
function buildingFiltering() {
    // checking if building are linked
    toLinkBuildings = buildings.filter(buildings => buildings.hasTR === 0 && buildings.hasTP === false)
    // list of unlinked landing areas
    unlinkedLA = toLinkBuildings.find(building => building.type === 'landing area')
    // list of unlinked lunar modules
    unlinkedLM = toLinkBuildings.find(building => building.type === 'lunar module')
    return toLinkBuildings, unlinkedLA, unlinkedLM;
}
// describe lunar module building model
class Building {
    constructor(id, type, level, x, y, hasTR, hasTP, isDesserved) {
        this.id = id;
        this.type = type
        this.level = level;
        this.x = x;
        this.y = y;
        this.hasTR = hasTR;
        this.hasTP = hasTP;
        this.isDesserved = isDesserved;
    }
}
// describe landing area building model
class LandingArea {
    constructor(id,type, x, y, monthlyArrivals, arrivingType, hasTR, isDesserved) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.monthlyArrivals = monthlyArrivals;
        this.arrivingType = arrivingType
        this.hasTR = hasTR;
        this.isDesserved = isDesserved;
    }
}
// describe pod model
class Pod {
    constructor(id, stops, travel) {
        this.id = id;
        this.stops = stops;
        travel = travel.split(' ');
        this.isActive = isActive
    }
}
// describe travel route model
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
    // turn counter
    let monthsOnMoon = 0;
    const resources = parseInt(readline());
    city.updateRessources(resources);
    const numTravelRoutes = parseInt(readline());
    for (let i = 0; i < numTravelRoutes; i++) {
        var inputs = readline().split(' ');
        const buildingId1 = parseInt(inputs[0]);
        const buildingId2 = parseInt(inputs[1]);
        const capacity = parseInt(inputs[2]);
        city.updateNewTradeRoute(buildingId1, buildingId2, capacity);
    }
    const numPods = parseInt(readline());
    
    for (let i = 0; i < numPods; i++) {
        const podProperties = readline();
        city.updatePodList(podProperties);
    }
    
    const numNewBuildings = parseInt(readline());
    for (let i = 0; i < numNewBuildings; i++) {
        const buildingProperties = readline();
        city.updateNewBuildings(numNewBuildings, buildingProperties);
    }
    let action = 'WAIT';
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT
    // PRIORITY 1 : LINK BUILDINGS
    buildingFiltering();
    while(toLinkBuildings.length > 0 && city.ressources > 500){
        action = "";
        if(unlinkedLA) {
            closestNodes = findClosestBuildingId(unlinkedLA)
            const tolerance = 0.01;
            const referenceDistance = closestNodes[0].distance;
            const filteredNodes = closestNodes.filter((node) => {
                return Math.abs(node.distance - referenceDistance) <= tolerance;
            });
            filteredNodes.forEach((node) => {
                if (city.ressources > 500){
                    action += `TUBE ${unlinkedLA.id} ${node.id};`;
                    city.buildings[unlinkedLA.id].hasTR++;
                    city.buildings[node.id].hasTR++;
                    city.ressources -= 500;
                }else {
                    return;
                }
            });
        }
    }
    // PRIORITY II :  Pods
    
    // spend vs save ressources
    // is there a pod need ?
    // is there a pod to upgrade ?
    // is there a teleporter need ?
    
    
    
    console.log(action);
    monthsOnMoon++;
}