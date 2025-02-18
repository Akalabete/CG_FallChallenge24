/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
class City {
    constructor(){
        this.resources = 0;
        this.buildings = [];
        this.travelRoutes = [];
        this.pods = [];
    }
    updateResources(resources){
        this.resources = resources;
    }
    updateTravelRoutes(routes) {
        this.travelRoutes = routes;
    }
    getLandingAreas() {
        return this.buildings.filter(b => b.type === 0);
    }

    getLunarModules() {
        return this.buildings.filter(b => b.type > 0);
    }

    calculateDistance(b1, b2) {
        return Math.sqrt(
            Math.pow(b1.coordX - b2.coordX, 2) + 
            Math.pow(b1.coordY - b2.coordY, 2)
        );
    }

    tubeIntersects(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Calcul de l'intersection de deux segments
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denominator === 0) return false;
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
        
        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }

    canCreateTube(b1, b2, existingTubes) {
        // Vérifier le nombre de connexions
        const b1Connections = b1.linkedTo.length;
        const b2Connections = b2.linkedTo.length;
        console.error(`Checking tube from ${b1.id}(${b1Connections} connections) to ${b2.id}(${b2Connections} connections)`);
        
        if (b1Connections >= 5 || b2Connections >= 5) {
            console.error(`Too many connections for buildings ${b1.id} or ${b2.id}`);
            return false;
        }
    
        // Vérifier les intersections
        for (let tube of existingTubes) {
            // Ne pas considérer comme intersection si un bâtiment est commun
            if (tube[0].id === b1.id || tube[0].id === b2.id || 
                tube[1].id === b1.id || tube[1].id === b2.id) {
                continue;
            }
            
            if (this.tubeIntersects(
                b1.coordX, b1.coordY, b2.coordX, b2.coordY,
                tube[0].coordX, tube[0].coordY, tube[1].coordX, tube[1].coordY
            )) {
                console.error(`Intersection detected between ${b1.id}-${b2.id} and ${tube[0].id}-${tube[1].id}`);
                return false;
            }
        }
        return true;
    }

}


class Building {
    constructor(id, type, coordX, coordY){ 
        this.id = id;
        this.type = type;
        this.coordX = coordX;
        this.coordY = coordY;
        this.linkedTo= [];
        this.arrivalAmountByTypes = [];
    }
    updateLinkedTo(travelRoutes) {
        // init array
        this.linkedTo = [];
        
        // Si des routes sont présentes, les ajouter
        if (travelRoutes && travelRoutes.length > 0) {
            travelRoutes.forEach(route => {
                if (route[0] === this.id) {
                    this.linkedTo.push(route[1]);
                } else if (route[1] === this.id) {
                    this.linkedTo.push(route[0]);
                }
            });
            // Éliminer les doublons avec Set
            this.linkedTo = Array.from(new Set(this.linkedTo));
        }
    }
    updateArrivalAmountByTypes(buildingProps) {
        // we create an array of 20 elements with 0 as value for each building
        this.arrivalAmountByTypes = Array.from({length: 20}, (_, i) => [i + 1, 0]);
        
        // if buildingprops has more than 4 elements, it has incoming arrivals, we update the array
        if (buildingProps.length > 4) {
            // Convertir les éléments en nombres
            const arrivals = buildingProps.slice(4).map(Number);
            console.error(arrivals)
            for (let i = 1; i < arrivals.length; i++) {
                this.arrivalAmountByTypes[arrivals[i]-1][1]++;
            }
        }
    }
}

// game loop
// game vars
const city = new City();
let turnAmount = 0;
let podAmount = 0;
let upgradablePods = [];
let unprocessedRoutes = new Map();
while (true) {
    turnAmount += 1;
    const resources = parseInt(readline());
    city.updateResources(resources);
    const numTravelRoutes = parseInt(readline());
    const travelRoutes = [];
    for (let i = 0; i < numTravelRoutes; i++) {
        const [buildingId1, buildingId2, capacity] = readline().split(' ').map(Number);
        travelRoutes.push([buildingId1, buildingId2, capacity]);
    }
    
    // Mettre à jour les routes dans la ville
    city.updateTravelRoutes(travelRoutes);

    // Mise à jour des connexions pour chaque bâtiment
    city.buildings.forEach(building => {
        building.updateLinkedTo(travelRoutes); // Utiliser travelRoutes local au lieu de city.travelRoutes
    });
    const numPods = parseInt(readline());
    for (let i = 0; i < numPods; i++) {
        const podProperties = readline();
    }
    const numNewBuildings = parseInt(readline());
    for (let i = 0; i < numNewBuildings; i++) {
        const buildingProperties = readline().split(' ').map(Number);
        const building = new Building(
            buildingProperties[1], // id
            buildingProperties[0], // type
            buildingProperties[2], // coordX
            buildingProperties[3]  // coordY
        );
        
        building.updateArrivalAmountByTypes(buildingProperties);
        building.updateLinkedTo(travelRoutes); // Utiliser travelRoutes local
        
        city.buildings.push(building);
    }
// génératin actions 
    let actions = [];
    let remainingResources = city.resources;  // Changé en let
    const RESERVE_POD = 1000;
    const existingTubes = [];

    if (turnAmount === 1) {  // Changé en 0 car le premier tour est 0
        const landingAreas = city.getLandingAreas();
        const lunarModules = city.getLunarModules();
        //console.error("Landing Areas:", landingAreas);
        //console.error("Lunar Modules:", lunarModules);
        let undeservedRoutes = [];
        landingAreas.forEach(landing => {
            landing.arrivalAmountByTypes.forEach((typeCount, index) => {
                //console.error(`Type ${index + 1}: ${typeCount[1]} arrivals`);
                if (typeCount[1] > 0) {
                    const moduleType = index + 1;
                    const matchingModules = lunarModules
                        .filter(m => m.type === moduleType)
                        .sort((a, b) => 
                            city.calculateDistance(landing, a) - 
                            city.calculateDistance(landing, b)
                        );

                    //console.error(`Found ${matchingModules.length} matching modules for type ${moduleType}`);
                    //console.error(matchingModules)
                    matchingModules.forEach(module => {
                        if (city.canCreateTube(landing, module, existingTubes)) {
                            const tubeCost = Math.floor(city.calculateDistance(landing, module) * 10);
                            //console.error(`Attempting tube to module ${module.id} of type ${module.type}`);
                            //console.error(`Cost: ${tubeCost}, Remaining: ${remainingResources}, After: ${remainingResources - tubeCost}`);
                            if (remainingResources - tubeCost >= RESERVE_POD) {
                                actions.push(`TUBE ${landing.id} ${module.id}`);
                                existingTubes.push([landing, module]);
                                remainingResources -= tubeCost;
                                //console.error(`Tube created to module ${module.id}`);
                                undeservedRoutes.push([landing.id, module.id, typeCount[1]]);
                            } else {
                                console.error(`Not enough resources for tube to module ${module.id}`);
                            }
                        } else {
                            console.error(`Cannot create tube to module ${module.id} - intersect or max connections`);
                        }
                    });
                }
            });
        });
        // Mettre à jour les bâtiments avec les nouvelles connexions
        city.buildings.forEach(building => {
            building.updateLinkedTo(travelRoutes);
        })
        if(undeservedRoutes.length > 0){
            let undeservedsLA = undeservedRoutes.filter(route => {
                const building = city.buildings.find(b => b.id === route[0]);
                return building && building.type === 0;
            });
            console.error('---' + undeservedsLA)


            if (undeservedsLA.length *1000 <= remainingResources){
                undeservedsLA.forEach(route => {
                    actions.push(`POD ${podAmount} ${route[0]} ${route[1]}`);
                    remainingResources -= 1000;
                    podAmount ++;
                });
            } else {
                let groupedRoutes = new Map();

                undeservedsLA.forEach(route => {
                    const landingId = route[0];
                    if (!groupedRoutes.has(landingId)) {
                        groupedRoutes.set(landingId, []);
                    }
                    groupedRoutes.get(landingId).push(route);
                });
                // create généric pod with the same LA 
                
                while (remainingResources >= 1000 && groupedRoutes.size > 0) {
                    // Convertir Map en Array pour pouvoir trier
                    let sortedGroups = Array.from(groupedRoutes.entries())
                        .sort((a, b) => b[1].length - a[1].length); // Tri par nombre de routes décroissant
                    
                    // Traiter les groupes triés
                    for (let [landingId, routes] of sortedGroups) {
                        if (remainingResources >= 1000) {
                            let podPath = "";
                            routes.forEach(route => {
                                podPath += `${route[0]} ${route[1]} `;
                            });
                            podPath += `${landingId}`; // Retour à la landing area
                            
                            actions.push(`POD ${podAmount} ${podPath.trim()}`);
                            upgradablePods.push(`${podAmount} ${podPath}`);
                            podAmount++;
                            remainingResources -= 1000;
                            
                            // Retirer le groupe traité
                            groupedRoutes.delete(landingId);
                        } else {
                            // Sauvegarder les routes non traitées
                            unprocessedRoutes.set(landingId, routes);
                        }
                    }
                    
                    console.error('Routes non traitées:', unprocessedRoutes);
                    break;
                }
            }
        }
    } else {
        //console.error("turn2" , unprocessedRoutes)
        const landingAreas = city.getLandingAreas();
        const lunarModules = city.getLunarModules();
        let newRoutes = [];

        // Vérifier les nouvelles connexions possibles
        landingAreas.forEach(landing => {
            landing.arrivalAmountByTypes.forEach((typeCount, index) => {
                if (typeCount[1] > 0) {
                    const moduleType = index + 1;
                    const matchingModules = lunarModules
                        .filter(m => m.type === moduleType)
                        .sort((a, b) => 
                            city.calculateDistance(landing, a) - 
                            city.calculateDistance(landing, b)
                        );

                    matchingModules.forEach(module => {
                        // Vérifier si le tube n'existe pas déjà
                        if (!landing.linkedTo.includes(module.id) && 
                            city.canCreateTube(landing, module, existingTubes)) {
                            const tubeCost = Math.floor(city.calculateDistance(landing, module) * 10);
                            if (remainingResources - tubeCost >= RESERVE_POD) {
                                actions.push(`TUBE ${landing.id} ${module.id}`);
                                existingTubes.push([landing, module]);
                                remainingResources -= tubeCost;
                                newRoutes.push([landing.id, module.id, typeCount[1]]);
                            }
                        }
                    });
                }
            });
        });

        // Mise à jour des bâtiments avec les nouvelles connexions
        city.buildings.forEach(building => {
            building.updateLinkedTo(travelRoutes);
        });

        if (remainingResources >= 1000 && unprocessedRoutes.size > 0) {
            console.error('Processing unprocessed routes from turn 1:', unprocessedRoutes);
            
            unprocessedRoutes.forEach((routes, landingId) => {
                if (remainingResources >= 1000) {
                    let podPath = "";
                    routes.forEach(route => {
                        podPath += `${route[0]} ${route[1]} `;
                    });
                    podPath += `${landingId}`; // Retour à la landing area
                    
                    actions.push(`POD ${podAmount} ${podPath.trim()}`);
                    upgradablePods.push(`${podAmount} ${podPath}`);
                    podAmount++;
                    remainingResources -= 1000;
                    
                    // Supprimer les routes traitées
                    unprocessedRoutes.delete(landingId);
                }
            });
        }
    }

    console.log(actions.join(';') || 'WAIT');
}


