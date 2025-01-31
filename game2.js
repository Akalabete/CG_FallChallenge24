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
            let typeCounts = Array(20).fill(0).map(() => [0, true]);
            let arrivalTypes = idSeq.slice(5);
            arrivalTypes.forEach(type => {
                type = parseInt(type);
                    if (type >= 1 && type <= 20) {
                        typeCounts[type - 1][0]++;
                        typeCounts[type - 1][1]=false;
                    }
                });
            const landingArea = new LandingArea(
                                                 idSeq[1],
                                                 idSeq[2],
                                                 idSeq[3],
                                                 idSeq[4],
                                                 typeCounts,
                                                 0
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
    constructor(id, x, y, monthlyArrivals, arrivingType, hasTR) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.monthlyArrivals = monthlyArrivals;
        this.arrivingType = arrivingType
        this.hasTR = hasTR;
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
        return 0; 
    }

    const x1 = parseFloat(building1.x);
    const y1 = parseFloat(building1.y);
    const x2 = parseFloat(building2.x);
    const y2 = parseFloat(building2.y);

    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

    // fn that calcultate the cost of a tube
function calculateTubeCost(distance, capacity) {
    return distance * capacity * 10
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
const startTime = performance.now();
const timeLimit = 1000;
while (true) {
    const startTime = performance.now();
    const timeLimit = 1000;
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
        // city.updateNewTube(buildingId1, buildingId2, capacity)
        
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
    const endTime = performance.now();
    console.error(`Execution Time: ${endTime - startTime}ms`)
    // seek unlinked LA and try to link them to their building type sorted by links and nodes chain links
    let unlinkedLA = city.landingAreas.filter(building => building.hasTR === 0)
    if (unlinkedLA.length >0) {
        unlinkedLA.forEach((LA) => {
            // extract arrival type and check if there are any, per types
            for (let i = 0; i < LA.arrivingType.length; i++){
                if(LA.arrivingType[i][0] > 0) {
                    // index = 0 => type 1
                    const type = i + 1;
                    // get an array of building of the same type
                    let LMArray = findBuildingByType(city, type)
                    // a link should be created on those without existing links prior
                    if(LMArray.length > 0){
                        let priorityLM = LMArray.filter(building => building.hasTR === 0)
                        let haveModuleToConnect = LMArray.filter(building => building.hasTR >1 && building.hasTR <5)
                        if(priorityLM.length > 0){
                            let tubeCost = calculateTubeCost(calculateLength(city, LA.id, priorityLM[0].id), 1);
                            if((resources-tubeCost)>1000){
                                action = tubeConstruction(LA.id, priorityLM[0].id, action);
                                city.resources = city.resources-tubeCost
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
                            let buildingCost = calculateTubeCost(closest.distance, 1)
                            if((city.resources-buildingCost) > 1000){
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
    // Prio 1 no pod and low resources
    // list all LA linked to LM of same type
    // Fonction pour trouver les types non desservis pour chaque LandingArea
    function findUndesservedTypes(landingArea) {
        return landingArea.arrivingType
            .map((typeCount, index) => typeCount[1] === false ? index + 1 : null)
            .filter(type => type !== null);
    }
    let undesservedsLA = city.landingAreas
    .map(la => {
        let undesservedTypes = findUndesservedTypes(la);
        return undesservedTypes.length > 0 ? { laId: la.id, types: undesservedTypes } : null;
    })
    .filter(la => la !== null);
    let tubeList = city.tubeList
    function getTubesForUndesservedLA(undesservedsLA, tubeList) {
        return undesservedsLA.map(la => {
            let connectedTubes = tubeList.filter(tube => tube.building1 === la.laId || tube.building2 === la.laId);
            return {
                laId: la.laId,
                types: la.types,
                tubes: connectedTubes
            };
        });
    }
    // Utilisation de la fonction pour récupérer les tubes pour chaque LA non desservi
let tubesForUndesservedLA = getTubesForUndesservedLA(undesservedsLA, tubeList);

// Afficher les détails complets des objets Tube
// console.error(JSON.stringify(tubesForUndesservedLA, null, 2));

// Exemple de traitement supplémentaire
if (tubesForUndesservedLA.length > 0) {
    // Travailler avec tubesForUndesservedLA comme un tableau
    for (let i = 0; i < tubesForUndesservedLA.length; i++) {
        let laId = tubesForUndesservedLA[i].laId;
        let tubes = tubesForUndesservedLA[i].tubes;
        if (tubes.length > 0) {
            let allPodsCanBeBuilt = (city.resources >= tubes.lenght* 1000) ? true : false;
            
            if ( allPodsCanBeBuilt) {
                
                tubes.forEach((tube) => {
                    const startBuilding = city.findBuildingById(tube.building1);
                    const targetBuilding = city.findBuildingById(tube.building2);
                    const targetBuildingType = targetBuilding.type;
                    const numberOfTraveler = startBuilding.arrivingType[targetBuildingType - 1][0];
                    const loopNeededToPurgePop = Math.ceil(numberOfTraveler / (tube.capacity * 10));
                    let loop = "";
                    for (let j = 0; j < loopNeededToPurgePop; j++) {
                        loop += `${tube.building1} ${tube.building2} `;
                    }
                    city.resources -= 1000;
                    let podId = podAmount;
                    podAmount ++;
                    action += `POD ${podId} ${loop.trim()};`;
                    // and it updates the podlist and the desserved arguments in the councerned buildings.
                    city.updatePodList(`${tube.building1}${tube.building2} ${loop.trim().split(' ').length} ${loop.trim()}`);
                    targetBuilding.isDesserved = true;
                    // need to change LA desserved arguments to add desservedByType....tbc
                    startBuilding.arrivingType[targetBuildingType-1][1] = true;   
                });  
            } else if(!allPodsCanBeBuilt && city.resources >= 1000) {
               // get the LA with the most connected LM 
               console.error('triggered')
               let longestChainLA = tubesForUndesservedLA.reduce((longest, la) => {
                    return (la.tubes.length > longest.tubes.length) ? la : longest;
                }, { laId: null, types: [], tubes: [] });
                // create a pod with a loop doing all the connection
                while(city.resources >= 1000  && longestChainLA) {
                    const tubes = longestChainLA.tubes;
                    const startBuilding = city.findBuildingById(longestChainLA.laId);
                    let podId = podAmount;
                    podAmount ++;
                    let podLoop = "";
                    let movingTravelerTypes = [];
                    let totalTravelersToMove = 0;
                    let lowestTubeCapacity = 5;
                     //define Pod ID
                    tubes.forEach((tube) => {
                        podLoop += `${tube.building1} ${tube.building2} `
                        let targetBuilding = city.findBuildingById(tube.building2)
                        movingTravelerTypes.push(targetBuilding.type);
                        if(tube.capacity <= lowestTubeCapacity) {
                            lowestTubeCapacity = tube.capacity
                        }
                        // modify the property of desserved while we have access to these data in the range
                        targetBuilding.isDesserved = true;
                        startBuilding.arrivingType[targetBuilding.type-1][1] = true;
                    })
                    movingTravelerTypes.forEach((travelerType) => {
                        totalTravelersToMove += startBuilding.arrivingType[travelerType-1][0]
                    })
                    
                    const loopNeededToPurgePop = Math.ceil(totalTravelersToMove/ movingTravelerTypes.length / (lowestTubeCapacity * 10));
                    
                    for(let i = 1; i < loopNeededToPurgePop; i++){
                        if(i<5){
                            podLoop += podLoop
                        }
                        
                    }
                    // generate the pod
                    action += `POD ${podId} ${podLoop.trim()};`
                    city.resources -= 1000;
                    // update desserveds 
                }
            }
        }
    }
} else {
    console.error("Aucun tube trouvé pour les LA non desservis.");
}

if (action === "") {
    action = "WAIT";
}

// ROI .... tbd cost&return vs interest 
console.log(action);
}