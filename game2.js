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
            let typeCounts = Array(20).fill(0);
            let arrivalTypes = idSeq.slice(5);
            arrivalTypes.forEach(type => {
                type = parseInt(type);
                    if (type >= 1 && type <= 20) {
                        typeCounts[type - 1]++;
                    }
                });
            const landingArea = new LandingArea(
                                                 idSeq[1],
                                                 idSeq[2],
                                                 idSeq[3],
                                                 idSeq[4],
                                                 typeCounts,
                                                 0,
                                                 false
                                                );

            this.landingAreas.push(landingArea)
        } else {
            const lunarModule = new LunarModule(
                                                idSeq[1],
                                                parseInt(idSeq[0]),
                                                idSeq[2],
                                                idSeq[3],
                                                0,
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
    constructor(id, x, y, monthlyArrivals, arrivingType, hasTR, isDesserved) {
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
    constructor(id, type, x, y, hasTR, hasTP, isDesserved) {
        this.id = id;
        this.type = type;
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
function tubeConstruction( building1, building2, action) {
    const startBuilding = city.findBuildingById(building1);
    const targetBuilding = city.findBuildingById(building2);
    const newSegment = [parseFloat(startBuilding.x), parseFloat(startBuilding.y), parseFloat(targetBuilding.x), parseFloat(targetBuilding.y)];
            const segmentsIntersectFlag = city.tubeList.some((tube) => {
                return segmentsIntersect(tube.segment, newSegment);
            });
    // verify if route exists
    const routeKey1 = `${building1}-${building2}`;
    const routeKey2 = `${building2}-${building1}`;
    const routeExists = createdRoutes.has(routeKey1) || createdRoutes.has(routeKey2);
    // calculate the cost of the tube

    if (!segmentsIntersectFlag && !routeExists) {
    // create the tube 
        action += `TUBE ${building1} ${building2};`
        startBuilding.hasTR += 1;
        targetBuilding.hasTR = targetBuilding.hasTR + 1;
       
        // Add the routes to the set
        createdRoutes.add(routeKey1);
        createdRoutes.add(routeKey2);
        return action;
    }else {
        return action;
    }
}
  //  fn that filter closest building with free TR
  //  building and id it would also check if that building is linked to a
  //  prper building type
function findClosestBuildingWithFreeLinks(city, buildingID) {
    let filteredNodesLA = city.landingAreas.filter(building => building.hasTR < 5 && building.hasTR > 0);
    let filteredNodesLM = city.lunarModules.filter(building => building.hasTR < 5 && building.hasTR > 0);
    // Fusionner les deux tableaux
    let filteredNodes = [...filteredNodesLA, ...filteredNodesLM];
    if (filteredNodes.length > 0) {
        const distances = filteredNodes.map((building) => {
            const distance = calculateLength(buildingID, building.id);
            return { building, distance };
        });

        const closestBuilding = distances.reduce((closest, current) => {
            return current.distance < closest.distance ? current : closest;
        });

        return closestBuilding.building;
    } else {
        return null;
    }
}
    // fn that find building by type of astronauts
function findBuildingByType(city, type){
    let answer = city.lunarModules.filter(building => building.type === type);
    return answer;
}
    // fn that return a global array of undesserved module or landing area
function findUndesservedModules(city) {
    let areNotDesservedLA = city.landingAreas.filter(building => building.isDesserved === false );
    let areNotDesservedLM = city.lunarModules.filter(building => building.isDesserved === false );
    let areNotDesserved = [...areNotDesservedLA, ...areNotDesservedLM]
    return areNotDesserved;
}

let city = new City();
const createdRoutes = new Set();
let podAmount = 0;
let turnAmount = 0;

while (true) {
    turnAmount += 1;
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
        const podProperties = readline().split(' ');
        const podId  = podProperties[0];
        const podStops = podProperties[1]
        const podTravel = podProperties.slice(2)
    }
    const numNewBuildings = parseInt(readline());
    for (let i = 0; i < numNewBuildings; i++) {
        const buildingProperties = readline();
        city.updateBuildingsLists(buildingProperties)
    }
    // seek unlinked LA and try to link them to their building type sorted by links and nodes chain links
    let unlinkedLA = city.landingAreas.filter(building => building.hasTR === 0)
    if (unlinkedLA.length >0) {
        unlinkedLA.forEach((LA) => {
            // extract arrival type and check if there are any, per types
            for (let i = 0; i < LA.arrivingType.length; i++){
                if(LA.arrivingType[i] > 0) {
                    // index = 0 => type 1
                    const type = i + 1;
                    // get an array of building of the same type
                    let LMArray = findBuildingByType(city, type)
                    // a link should be created on those without existing links prior
                    if(LMArray.length > 0){
                        let priorityLM = LMArray.filter(building => building.hasTR === 0)
                        let haveModuleToConnect = LMArray.filter(building => building.hasTR >1 && building.hasTR <5)
                        if(priorityLM.length > 0){
                            buildingCost = calculateTubeCost(LA.id, priorityLM[0].id);
                            if((resources-buildingCost)>0){
                                action = tubeConstruction(LA.id, priorityLM[0].id, action);
                                city.resources = city.resources-buildingCost
                                city.updateNewTube(LA.id, priorityLM[0].id, 1);
                            }else {
                                return
                            }
                        // if no unlinked LM of same type, seek closest node of same type
                        }else if (!priorityLM && haveModuleToConnect.length>0) {
                            // we get the closest module of this type with free links
                            const distances = haveModuleToConnect.map((building) => {
                                const distance = calculateLength(LA.id, building.id);
                                return { building, distance };
                                });
                    
                            const closestBuilding = distances.reduce((closest, current) => {
                                return current.distance < closest.distance ? current : closest;
                                });
                            let buildingCost = calculateTubeCost(LA.id, closestBuilding.id)
                            if((city.resources-buildinCost) > 0){
                                action = tubeConstruction(LA.id, closestBuilding.id, action);
                                city.resources = city.resources-buildingCost
                                city.updateNewTube(LA.id, closestBuilding.id, 1);
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
            // control if this unlinked LA found no module of his type to connect
            if(LA.hasTR === 0){
                let availNode = findClosestBuildingWithFreeLinks(city, LA.id)
                if (availNode){
                    let buildingCost = calculateTubeCost(LA.id, availNode.id, action);
                    if((city.resources-buildingCost) > 0){
                        action= constructTube(LA.id, availNode.id, action);
                        city.resources = city.resources-buildingCost
                        city.updateNewTube(LA.id, availNode.id, 1);
                    }else {
                        return;
                    }   
                }else {
                    return;
                }
                
                // case1 this module is LA add the arrivaltype to his object
                // case2 this module is a LM , need to check if this module can be poded to a proper building type or if need to create a tube
            }
        })
    }
    // step II creating pods
    // create a list of undesserved buildings
    
    
    //if (hasUndesserved.length > 0){
        
        // check what segments can be cumulated
        
        // check money for pod building
      //  let canAffordPod = (city.resources - 500) > 0 ? true : false;

        // compar
        // regroup per type
        // check if they have a tube 
            // and if that tube is connected to the proper type
            // if it does create a pod with id of the buildingdesserveds the number of stops is the amount total of incomers /10 * number of building desserved
                // update the podList
                // update the building objects 
            // if not seek the way to connect to closest tube that has the correct stops
        // at a point need to check if the routes need to be upgraded & a pod duplicated
        // need to compare the upgrade + new pod cost vs interest of incomes.
    //}
    // Fonction pour vérifier si une route dessert tous les bâtiments non desservis
function canCreateRouteForUndesserved(city, undesservedBuildings) {
    let tubes = city.tubeList;
    let undesservedIds = undesservedBuildings.map(building => building.id);

    // verify weither undeserved building have a tube or not
    for (let i = 0; i < undesservedIds.length; i++) {
        let buildingId = undesservedIds[i];
        let isConnected = tubes.some(tube => tube.building1 === buildingId || tube.building2 === buildingId);
        if (!isConnected) {
            return false;
        }
    }
    return true;
}
// fn that generate pod stops
function generatePodStops(chain) {
    let stops = [];
    for (let i = 0; i < chain.length - 1; i++) {
        stops.push(chain[i]);
        stops.push(chain[i + 1]);
        stops.push(chain[i]);
    }
    stops.push(chain[chain.length - 1]);
    return stops;
}
// fn that create  a pod
function createPod(city, undesservedBuildings, action) {
    let podId = city.podList.length + 1;
    let stops = generatePodStops(undesservedBuildings.map(building => building.id));
    let travel = stops.join(' ');

    action += `POD ${podId} ${travel};`;

    // updt desserved building list
    undesservedBuildings.forEach(building => {
        building.isDesserved = true;
    });

    // add pod to list
    city.podList.push(new Pod(podId, stops, travel.split(' ')));

    return action;
}

// try to push a pod in 
let hasUndesserved = findUndesservedModules(city);

if (hasUndesserved.length > 0) {
    let canAffordPod = (city.resources - 500) > 0 ? true : false;

    if (canAffordPod && canCreateRouteForUndesserved(city, hasUndesserved)) {
        action = createPod(city, hasUndesserved, action);
        city.resources -= 500; // cost of a pod
    }
}
    if(action === ""){
        action = "WAIT"
    }
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    
    console.log(action);     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT
    
}
