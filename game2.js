/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/


// game loop

// class Definitions
class City {
    constructor() {
        this.resources = 0;
        this.landingAreas = [];
        this.lunarModules = [];
        this.tubeList = [];
        this.podList = [];
    }
    updateNewTube(building1ID, building2ID, capacity) {
        if (!this.travelRoutes) {
            this.travelRoutes = [];
        }

        const existingTube = this.travelRoutes.find(travelRoute => 
            travelRoute.building1 === String(building1ID) && 
            travelRoute.building2 === String(building2ID) && 
            travelRoute.capacity === capacity
        );

        if (!existingTube) {
            const building1 = this.findBuildingById(building1ID);
            const building2 = this.findBuildingById(building2ID);
            const length = calculateLength(this, String(building1ID), String(building2ID));
            const segment = [building1.x, building1.y, building2.x, building2.y] ;
            const cost = length * 0.1 * capacity
            const newTube = new Tube(
                    length,
                    segment,
                    String(building1ID),
                    String(building2ID),
                    capacity,
                    cost 
                );
            this.tubeList.push(newTube);

            

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

    findBuildingById(buildingId) {
        return  this.landingAreas.find(building => building.id === String(buildingId))||
                this.lunarModules.find(building => building.id === String(buildingId));
    }
    updateResources(resources) {
        this.resources = resources;
    }
    updateBuildingsLists(buildingProps) {
        const idSeq = buildingProps.split(' ')
        if (idSeq[0] === "0") {
            let arrivalByType = idSeq.slice(5);
            const landingArea = new LandingArea(
                                                 idSeq[1],
                                                 idSeq[2],
                                                 idSeq[3],
                                                 idSeq[4],
                                                 arrivalByType,
                                                 false,
                                                 false
                                                );

            this.landingAreas.push(landingArea)
        } else {
            const lunarModule = new LunarModule(
                                                idSeq[1],
                                                idSeq[0],
                                                idSeq[2],
                                                idSeq[3],
                                                false,
                                                false,
                                                false
                                                )
            this.lunarModules.push(lunarModule)
        }
                                        
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
    destroyPodByID(podId) {
        action += `DESTROY ${podID}`
        this.podList = this.podList.filter(pod => podList.id!== podId )
    }
    
}

class LandingArea {
    constructor(id,type, x, y, monthlyArrivals, arrivingType, hasTR, isDesserved) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.monthlyArrivals = monthlyArrivals;
        this.arrivingType = arrivingType
        this.hasTR = hasTR;
        this.isDesserved = isDesserved;
    }
}
class LunarModule {
    constructor(id, type, level, x, y, hasTR, hasTP, isDesserved) {
        this.id = id;
        this.level = level;
        this.x = x;
        this.y = y;
        this.hasTR = hasTR;
        this.hasTP = hasTP;
        this.isDesserved = isDesserved;
    }
}
class Tube {
    constructor (length, segment, building1, building2, capacity, cost) {
        this.length = length;
        this.segment = segment;
        this.building1 = building1;
        this.building2 = building2;
        this.capacity = capacity;
        this.cost = cost;
    }
}
class Pod {
    constructor(id, stops, travel) {
        this.id = id;
        this.stops = stops;
        this.travel = travel
    }
}

// functions definitions
  
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

    // fn that calcultate the cost of a tube
function calculateTubeCost(distance, capacity) {
    return distance * capacity * 0.1
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
    // fn that create a tube 
function tubeConstruction( building1, building2) {
    const newSegment = [parseFloat(building1.x), parseFloat(building1.y), parseFloat(building2.x), parseFloat(building2.y)];
            const segmentsIntersectFlag = city.travelRoutes.some((travelRoute) => {
                return segmentsIntersect(travelRoute.segment, newSegment);
            });
    // verify if route exists
    const routeKey1 = `${building1.id}-${building2.id}`;
    const routeKey2 = `${building2.id}-${building1.id}`;
    const routeExists = createdRoutes.has(routeKey1) || createdRoutes.has(routeKey2);
    // calculate the cost of the tube
    const distance = calculateLength(city, building1, building2)
    // verify if nough funds
    const constructionPossible = (resource - calculateTubeCost( distance, 1)> 0 ) ? true : false;
    
    if (constructionPossible && !segmentsIntersectFlag && !routeExists) {
    // create the tube 
        action += `TUBE ${building.id} ${node.id};`;
        building.hasTR = parseInt(building.hasTR) + 1;
        const targetBuilding = city.findBuildingById(node.id);
        targetBuilding.hasTR = parseInt(targetBuilding.hasTR) + 1;
        ressources -= thisTubeCost;
        // Add the routes to the set
        createdRoutes.add(routeKey1);
        createdRoutes.add(routeKey2);
    }else {
        return;
    }
}
let city = new City()
const createdRoute = new Set()

let podAmount = 0;

while (true) {
    let action = '';
    
    const resources = parseInt(readline());
    city.updateResources(resources)
    const numTravelRoutes = parseInt(readline());
    for (let i = 0; i < numTravelRoutes; i++) {
        var inputs = readline().split(' ');
        const buildingId1 = parseInt(inputs[0]);
        const buildingId2 = parseInt(inputs[1]);
        const capacity = parseInt(inputs[2]);
        city.updateNewTube(buildingId1, buildingId2, capacity)
        
    }
    const numPods = parseInt(readline());
    for (let i = 0; i < numPods; i++) {
        const podProperties = readline();
    }
    const numNewBuildings = parseInt(readline());
    for (let i = 0; i < numNewBuildings; i++) {
        const buildingProperties = readline();
        city.updateBuildingsLists(buildingProperties)
    }
    // seek unlinked LA and try to link them to their building type sorted by links and nodes chain links
    let unlinkedLA = city.landingAreas.filter(building => building.hasTr === 0)
    if (unlinkedLA.length >0) {
        unlinkedLA.forEach((LA) => {
            // extract arrival type and check if there are any, per types
            for (let i = 0; i < LA.arrivalByType.length; i++){
                if(LA.arrivalByType[i] > 0) {
                    // index = 0 => type 1
                    const type = LA.arrivalByType[i]+1
                    // get an array of building of the same type
                    let LMArray = findBuildingByType(type)
                    // a link should be created on those without existing links prior
                    if(LMArray.length > 0){
                        let priorityLM = LMArray.filter(building => building.hasTr = 0)
                        let haveModuleToConnect = findClosestModule(LA.id).filter(building => building.hasTR <= 4)
                        if(priorityLM.length > 0){
                            let canBuild = estimateCost(LA.id, priorityLM[0].id) 
                            if(canBuild){
                                constructTube(LA.id, priorityLM[0].id);
                                city.updateNewTube(LA.id, priorityLM[0].id, 1);
                            }else {
                                return
                            }
                        // if no unlinked LM of same type, seek closest node of same type
                        }else if (!priorityLM && haveModuleToConnect.length>0) {
                            let canBuild = estimateCost(LA.id, haveModuleToConnect[0].id);
                            if(canBuild){
                                constructTube(LA.id, haveModuleToConnect[0].id);
                                city.updateNewTube(LA.id, haveModuleToConnect[0].id, 1);
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    }else {
                        return;
                    }
                }else {
                    return;
                }
            };
            // control if this unlinked LA found a 
            if(LA.hasTR === 0){
                findClosestBuildingWithFreeLinks()
                // case1 this module is LA add the arrivaltype to his object
                // case2 this module is a LM , need to check if this module can be poded to a proper building type or if need to create a tube
            }
        })
    } 
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    if (action === ''){
        action === 'WAIT'
    }
    console.log(actions);     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT

}
