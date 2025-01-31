class City {
    constructor() {
        this.ressources = 0;
        this.landingAreas = [];
        this.lunarModules = [];
        this.tubesList = [];
        this.podsList = []
    }
    updateBuildingsLists(buildingProps) {
        const idSeq = buildingProps.split(' ')
        let typeCounts = Array(20).fill(0).map(() => [0, true]);
        if (idSeq[0] === "0") {
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
                                                null,
                                                false,
                                                typeCounts
                                                )
            this.lunarModules.push(lunarModule)
        }
                                        
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

let city = new City();
//********
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
        city.updateBuildingsLists(buildingProperties)
    }

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    function filter(list){
        let filteredList = [];
        list.forEach((building) => {
            // Filtrer les types non traités
            let filteredTypes = building.arrivalTypes
                .map((typeCount, index) => typeCount[1] === false ? index + 1 : null)
                .filter(type => type !== null);
            
            // Si des types non traités sont trouvés, ajouter à la liste filtrée
            if (filteredTypes.length > 0) {
                filteredList.push({ id: building.id, unhandledTypes: filteredTypes });
            }
        });
        return filteredList;
    }
    console.error(filter(city.landingAreas))
    console.log('TUBE 0 1;TUBE 0 2;POD 42 0 1 0 2 0 1 0 2');     // TUBE | UPGRADE | TELEPORT | POD | DESTROY | WAIT
    
}