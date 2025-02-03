class City {
    constructor() {
        this.resources = 0;
        this.landingAreas = [];
        this.lunarModules = [];
        this.tubesList = [];
        this.podsList = [];
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
            const segment = [building1.x, building1.y, building2.x, building2.y];
            const cost = length * 0.1 * capacity;
            const newTube = new Tube(
                length,
                segment,
                String(building1ID),
                String(building2ID),
                capacity,
                cost
            );
            this.tubesList.push(newTube);

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

    updateBuildingsLists(buildingProps) {
        const idSeq = buildingProps.split(' ');
        let typeCounts = Array(20).fill(0).map(() => [0, true]);
        if (idSeq[0] === "0") {
            let arrivalTypes = idSeq.slice(5);
            arrivalTypes.forEach(type => {
                type = parseInt(type);
                if (type >= 1 && type <= 20) {
                    typeCounts[type - 1][0]++;
                    typeCounts[type - 1][1] = false;
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

            this.landingAreas.push(landingArea);
        } else {
            const lunarModule = new LunarModule(
                idSeq[1],
                parseInt(idSeq[0]),
                idSeq[2],
                idSeq[3],
                null,
                false,
                typeCounts
            );
            this.lunarModules.push(lunarModule);
        }
    }

    updateResources(resources) {
        this.resources = resources;
    }

    findBuildingById(buildingId) {
        return this.landingAreas.find(building => building.id === String(buildingId)) ||
               this.lunarModules.find(building => building.id === String(buildingId));
    }
}
class LandingArea {
    constructor(id, x, y, monthlyArrivals, arrivalTypes, linkedTo) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.monthlyArrivals = monthlyArrivals;
        this.arrivalTypes = arrivalTypes
        this.linkedTo = linkedTo;
    }
}
class LunarModule {
    constructor(id, type, x, y, linkedTo, hasTP, arrivalTypes) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.linkedTo = linkedTo;
        this.hasTP = hasTP;
        this.arrivalTypes = arrivalTypes;
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

// FUNCTIONS DEFINITION
    // Filter either landingAreas OR lunarModules
        // return an ARRAY Of Objects { id : number, unhandledTypes: [[type, number],...]}
    function filterUnhandledAstronauts(list) {
        let filteredList = [];
        list.forEach((building) => {
            // Filtrer les types non traités et inclure le nombre d'astronautes non traités
            let filteredTypes = building.arrivalTypes
                .map((typeCount, index) => typeCount[1] === false ? [index + 1, typeCount[0]] : null)
                .filter(type => type !== null);
            
            // Si des types non traités sont trouvés, ajouter à la liste filtrée
            if (filteredTypes.length > 0) {
                filteredList.push({ id: building.id, unhandledTypes: filteredTypes });
            }
        });
        return filteredList;
    }
    // fn that find buildings by type of astronauts
function findClosestBuildingsByType(list, origin, type){
    let buildingsOfThisType = list.filter(building => building.type === type);
    const distances = buildingsOfThisType.map((building) => {
        const distance = calculateLength(city, origin, building.id);
        return { building, distance };
    })
    const closestBuildingsOfThisType = distances.reduce((closest, current) => {
        return current.distance < closest.distance ? current : closest;
        });
    return closestBuildingsOfThisType;
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
        startBuilding.linkedTo.push(targetBuilding.id);
        targetBuilding.linkedTo.push(startBuilding.id);
       
        // Add the routes to the set
        createdRoutes.add(routeKey1);
        createdRoutes.add(routeKey2);
        return action;
    }else if(segmentsIntersectFlag){
        return !segmentsIntersectFlag;
    }else {
        return !routeExists
    }
}
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
    // fn that return all unhandled arrivals
function unhandledArrivals(city) {
    let unhandledArrivalsLA = filterUnhandledAstronauts(city.landingAreas);
    let unhandledArrivalsLM = filterUnhandledAstronauts(city.lunarModules);         
    let unhandledArrivals = [ ...unhandledArrivalsLA, ...unhandledArrivalsLM];
    return unhandledArrivals;
}
let city = new City();
const creactedRoutes = new Set();
let turnAmount = 0;
let podAmount = 0;
let podIncrémentor = 0;
//********
while (true) {
    const startTime = performance.now();
    let action = ""
    let execTime = 0
    turnAmount += 1;
    const resources = parseInt(readline());
    city.updateResources(resources);
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
        city.updateBuildingsLists(buildingProperties)
    }

    let unhandledLAArrivalsBuildingList = filterUnhandledAstronauts(city.landingAreas)
    // first turn execution time
    if(turnAmount === 1 ){
        const timeConstraint = 1000;
    } else {
        const timeConstraint = 500;
    }
    const initialLoopTimer = performance.now();
    execTime += initialLoopTimer;
        // verify the time of the process doesnt exceed 1s
    while(execTime < timeConstraint){
        const  thisLoopTimer = performance.now();
        // first turn need to stash 1K ress to create at least 1 pod
        while(city.resources > 1000){
            // analyse the arrivals by type
            unhandledLAArrivalsBuildingList.forEach((arrivialsAtBuilding) => {
                arrivalsList = arrivialsAtBuilding.unhandledTypes;
                // for each types of unhandles arrivals at each building
                arrivalsList.forEach((type)=> {
                    // create an array of tube with type 
                    let routeToDesserve = [];
                    // find closest final building of this type
                    listOfBuildingsOfThisType = findClosestBuildingsByType(city.lunarModules, arrivialsAtBuilding.id,type);
                    // filter that those have free links
                    filteredList = listOfBuildingsOfThisType.filter(building => building.linkedTo.length >= 4);
                    // if not, choosing closest node to link to (LM or LA)
                    //  /!\ can implement a different list here with same loop
                    // if there are
                    if (filteredList) {
                        let constructed = false;
                        let canBuild = true;
                        let i = 0;
                        // create a loop that take the possible building list to link to
                        while(!constructed && canBuild && i < filteredList.length){
                            // calc the cost of the tube
                            const tubeCost = calculateTubeCost(calculateLength(city, arrivialsAtBuilding.id, filteredList[i].id), 1);
                            // compare to city.res
                            if(city.resources - tubeCost < 1000 ){
                                // if not enough, get out of the loop
                                canBuild = false;
                            } else {
                                // verify that this tube can be constructed, without crossing any other
                                let obstacle = tubeConstruction(arrivialsAtBuilding.id, filteredList[i].id, action );
                                // if obstacle swap to next
                                if (!obstacle){
                                    // modify index of the list && if no more, exit loop
                                    i++;
                                }else {
                                    // all is ok , tube build and resources updated, exiting loop
                                    constructed = !constructed
                                    city.resources -= tubeCost
                                    routeToDesserve.push([arrivialsAtBuilding.id, filteredList[i].id, type])
                                }
                            }                               
                        }
                    } else {
                        // tbi link to a closest free building by default ?? ?? ??
                        return;
                    }
                const timerPointer  = performance.now();
                execTime += (timerPointer - thisLoopTimer) ;
                });    
            });
            routesToDesserve.forEach((route) => {
                if(city.resources > 1000){
                    let podLoop = 
                    action += `${podAmount} ${podLoop};`
                }
            })
        }

    }
    
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    console.error(unhandledLAArrivalsBuildingList)
    console.log('TUBE 0 1;TUBE 0 2;POD 42 0 1 0 2 0 1 0 2');     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT
    
}