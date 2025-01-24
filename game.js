/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/


// game loop
class City {
    constructor() {
        this.ressources = 0;
        this.buildings = {
            landingAreas: [],
            lunarModules: []
        };
        this.travelRoutes = [];
        this.podList = [];
    }

    updateNewTradeRoute(building1ID, building2ID, capacity) {
        if (!this.travelRoutes) {
            this.travelRoutes = [];
        }

        const existingRoute = this.travelRoutes.find(travelRoute => 
            travelRoute.building1 === String(building1ID) && 
            travelRoute.building2 === String(building2ID) && 
            travelRoute.capacity === capacity
        );

        if (!existingRoute) {
            const building1 = this.findBuildingById(building1ID);
            const building2 = this.findBuildingById(building2ID);
            const length = calculateLength(this, String(building1ID), String(building2ID));
            const segment = [building1.x, building1.y, building2.x, building2.y] ;
            const cost = length * 0.1 * capacity
            const newRoute = new TravelRoute(
                    length,
                    segment,
                    String(building1ID),
                    String(building2ID),
                    capacity,
                    false,
                    cost 
                );
            this.travelRoutes.push(newRoute);

            

            if (building1) {
                building1.hasTR++;
            } else {
                console.error(`Building with ID ${building1ID} not found.`);
            }

            if (building2) {
                building2.hasTR++;
            } else {
                console.error(`Building with ID ${building2ID} not found.`);
            }
        }
    }

    findBuildingById(buildingID) {
        return this.buildings.landingAreas.find(building => building.id === String(buildingID)) ||
               this.buildings.lunarModules.find(building => building.id === String(buildingID));
    }

    updateRessources(ressources) {
        this.ressources = ressources;
    }

    updatePodList(podProperties) {
        let found = false;
        this.podList.forEach((pod) => {
            pod.isActive = false;
            // search pod with same ID
            if (pod.id === podProperties[0]) {
                found = true;
                pod.isActive = true;
                // update list of stops / stops number in case of recreating the pod with same id
                if (podProperties[1] !== pod.stops || podProperties[2].split(' ') !== pod.travel) {
                    pod.stops = podProperties[1];
                    pod.travel = podProperties[2].split(' ');
                } else {
                    return;
                }
            } else {
                return;
            }
        });
        // if not present we create
        if (!found) {
            const pod = new Pod(podProperties[0], podProperties[1], podProperties[2].split(' '), true);
            this.podList.push(pod);
        } else {
            return;
        }
        // update active pod list
        this.podList = this.podList.filter(pod => pod.isActive === true);
    }

    updateNewBuildings(buildingProperties) {
        // extract properties
        let BPArray = buildingProperties.split(' ');
        // verify if it is a landing area or a building
        if (BPArray[0] === '0') {
            if (BPArray[4] > 0) {
                let astroType1 = 0;
                let astroType2 = 0;
                let astroType3 = 0;
                let astroType4 = 0;
                let astroType5 = 0;
                let astroType6 = 0;
                // create and populate an array of astronauts types
                for (let j = 5; j < BPArray.length; j++) {
                    switch (BPArray[j]) {
                        case '1':
                            astroType1++;
                            break;
                        case '2':
                            astroType2++;
                            break;
                        case '3':
                            astroType3++;
                            break;
                        case '4':
                            astroType4++;
                            break;
                        case '5':
                            astroType5++;
                            break;
                        case '6':
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
                this.buildings.landingAreas.push(landingArea);
            } else {
                return;
            }
            // create and push the lunar module object in the buildings array
        } else {
            const building = new Building(
                BPArray[1],
                "lunar module",
                BPArray[0],
                BPArray[2],
                BPArray[3],
                0,
                false,
                false,
            );
            this.buildings.lunarModules.push(building);
        }
    }
}

// fn that calculate the length of the travel route
function calculateLength(city, building1ID, building2ID) {
    const building1 = city.findBuildingById(building1ID);
    const building2 = city.findBuildingById(building2ID);

    if (!building1 || !building2) {
        console.error(`Building not found: ${!building1 ? building1ID : ''} ${!building2 ? building2ID : ''}`);
        return 0; // ou une autre valeur par défaut appropriée
    }

    const x1 = parseFloat(building1.x);
    const y1 = parseFloat(building1.y);
    const x2 = parseFloat(building2.x);
    const y2 = parseFloat(building2.y);

    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// fn that find the closest buildings from 1 and give an array
function findClosestBuildingIds(buildingA) {
    // filter buildingA from the list
    const cityBuildingListMinusA = [...city.buildings.landingAreas, ...city.buildings.lunarModules].filter(building => building.id !== buildingA.id && building.hasTR <= 4);

    // calculate distance for buildings
    const distances = cityBuildingListMinusA.map((building) => {
        const xA = parseFloat(buildingA.x);
        const yA = parseFloat(buildingA.y);
        const xB = parseFloat(building.x);
        const yB = parseFloat(building.y);
        const distance = Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2));
        return { id: building.id, distance: distance };
    });

    // sort the distances
    distances.sort((a, b) => a.distance - b.distance);

    // return id & distance in an array
    return distances;
}

// fn that filters the building without connection
function buildingFiltering() {
    // checking if buildings are linked
    // list of unlinked landing areas
    const unlinkedLA = city.buildings.landingAreas.filter(building => building.monthlyArrivals > 0 && building.hasTR === 0);
    // list of unlinked lunar modules
    const unlinkedLM = city.buildings.lunarModules.filter(building => building.hasTR === 0);
    return { unlinkedLA, unlinkedLM };
}
// fn that take 2  segment and verify its not crossing one other
function segmentsIntersect(segment1, segment2) {
    const [x1, y1, x2, y2] = segment1;
    const [x3, y3, x4, y4] = segment2;

    function ccw(A, B, C) {
        return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
    }

    return (ccw([x1, y1], [x3, y3], [x4, y4]) !== ccw([x2, y2], [x3, y3], [x4, y4])) &&
           (ccw([x1, y1], [x2, y2], [x3, y3]) !== ccw([x1, y1], [x2, y2], [x4, y4]));
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
        this.travel = travel
    }
}
// describe travel route model
class TravelRoute {
    constructor(length,segment, building1, building2, capacity, hasTraffic, cost) {
        this.length = length;
        this.segment = segment;
        this.building1 = building1;
        this.building2 = building2;
        this.capacity = capacity;
        this.hasTraffic = hasTraffic;
        this.cost = cost;
    }
    updateHasTraffic(pod) {
        PPArray = pod.travel
        if (PPArray.find(pod => pod.building1 === this.building1 && pod.building2 === this.building2)){
            this.hasTraffic = true;
        }
    }
}
let podID = 0
const city = new City();
const createdRoutes = new Set();

while (true) {
    // turn counter
    let monthsOnMoon = 0;
    const resources = parseInt(readline());
    city.updateRessources(resources);
    const numTravelRoutes = parseInt(readline());
    for (let i = 0; i < numTravelRoutes; i++) {
        const inputs = readline().split(' ');
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
        city.updateNewBuildings(buildingProperties);
    }
    let action = 'WAIT';
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT
    // PRIORITY 1 : LINK BUILDINGS

    // state of ressources hardcoded true for now
    let ressources = city.ressources;
    let canBuild = true;

    // while loop while we have fund and unlinked buildings
    let { unlinkedLA, unlinkedLM } = buildingFiltering();
    let unlinkedBuildings = [...unlinkedLA, ...unlinkedLM]; // Fusion des deux tableaux

    while (canBuild && unlinkedBuildings.length > 0) {
        action = ''
        unlinkedBuildings.forEach((building) => {
            const closestNodes = findClosestBuildingIds(building);
            const tolerance = 0.01;
            const referenceDistance = closestNodes[0].distance;
            const filteredNodes = closestNodes.filter((node) => {
                return Math.abs(node.distance - referenceDistance) <= tolerance;
            });
            filteredNodes.forEach((node) => {
                const newSegment = [parseFloat(building.x), parseFloat(building.y), parseFloat(node.x), parseFloat(node.y)];
                const segmentsIntersectFlag = city.travelRoutes.some((travelRoute) => {
                    return segmentsIntersect(travelRoute.segment, newSegment);
                });
                // Vérifiez si une route existe déjà
                const routeKey1 = `${building.id}-${node.id}`;
                const routeKey2 = `${node.id}-${building.id}`;
                const routeExists = createdRoutes.has(routeKey1) || createdRoutes.has(routeKey2);
                // calculate the cost of the tube
                const costPerKm = 0.1;
                const thisTubeCost = node.distance * costPerKm;
                const constructionPossible = ((ressources - thisTubeCost) >= 0);

                if (constructionPossible && !segmentsIntersectFlag && !routeExists) {
                    // verification if the tube won't cross another tube
                    action += `TUBE ${building.id} ${node.id};`;
                    building.hasTR = parseInt(building.hasTR) + 1;
                    const targetBuilding = city.findBuildingById(node.id);
                    targetBuilding.hasTR = parseInt(targetBuilding.hasTR) + 1;
                    ressources -= thisTubeCost;
                    // Ajouter la route à l'ensemble des routes créées
                    createdRoutes.add(routeKey1);
                    createdRoutes.add(routeKey2);
                    // Mise à jour de la liste des bâtiments non connectés après les connexions des zones d'atterrissage
                    ({ unlinkedLA, unlinkedLM } = buildingFiltering());
                    unlinkedBuildings = [...unlinkedLA, ...unlinkedLM]; // Mise à jour de la fusion des deux tableaux
                } else if (!constructionPossible) {
                    // fund lacking, we stop the loop
                    canBuild = false;
                } else {
                    return;
                }
            });
        });
    }
    
    // PRIORITY II :  Pods
    // listing undesserved by a pod nodes
    tradeRoutesList = city.travelRoutes;
    tradeRoutesList.forEach((tradeRoute) => {
        if (tradeRoute.hasTraffic === false && ressources > 1000) {
            if(action === 'WAIT'){
                action = '';
            }
            const building1 = city.findBuildingById(tradeRoute.building1);
            const building2 = city.findBuildingById(tradeRoute.building2);
            if (building1.isDesserved === false || building2.isDesserved === false) {
                podID++
                action += `POD ${podID} ${tradeRoute.building1} ${tradeRoute.building2} ${tradeRoute.building1};`;
                tradeRoute.hasTraffic = true;
                building1.isDesserved = true;
                building2.isDesserved = true;
            }
        }
    });

    
    // spend vs save ressources
    // is there a pod need ?
    // is there a pod to upgrade ?
    // is there a teleporter need ?
    console.log(action);
    monthsOnMoon++;
}