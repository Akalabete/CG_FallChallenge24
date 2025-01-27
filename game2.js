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

let city = new City()
const createdRoute = new Set()



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
                       
                        if(priorityLM){
                            canBuild = estimateCost(LA, priorityLM) 
                            if(canBuild){
                                constructTube(LA,priorityLM);

                            }else {
                                return
                            }
                        }else {
                            // tbd , take the closest linked to this building type and if can construct tube, if not take the next closest
                            return;
                        } 
                    }
                }
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
