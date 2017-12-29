"use strict";

var processor = {

  getRace: function(raceId) {
    var race =  {
      drivers: null,
      lapTimes: null,
      pitStops: null,
      qualifying: null,
      results: null,
      raceInfo: null,

    };

    race.drivers = queries.getDriversByRaceId(raceId);
    race.lapTimes = queries.getLapDataByRaceId(raceId);
    race.qualifying = queries.getQualifingDataByRaceId(raceId);
    race.pitStops = queries.getPitStopsByRaceId(raceId);
    race.results = queries.getResultsByRaceId(raceId);
    race.raceInfo = queries.getRaceById(raceId);

    return race;
  },

  getEnhancedLapDataPerDriver: function(raceData) {
    var result = [];
    raceData.drivers.forEach((driver) => {
      var lapData = {
        driver: null,
        laps: [],
      };
      lapData.driver = driver;
      //Attach Qualifying Data
      lapData.qualifying = processor.getQualifyingForDriver(raceData, driver);
      //add Qualifying Data to the Laps
      var lap0 = {'driverId': driver.driverId, 'lap': 0};
      // Figure out the position of that driver
      if (lapData.qualifying !== undefined) {
        // Use qualifying data, if available
        lap0['position'] = lapData.qualifying.position;
      } else {
        // TODO: Easy fallback.
        // Maybe just take result from first lap - Future: Perhaps leave out that data point at all
        lap0['position'] = 0;
      }

      var endResult = raceData.results.filter(res => res.driverId == driver.driverId && res.laps == 0);
      if(endResult.length > 0){
        lap0.finished = endResult[0];
      }
      lapData.laps.push(lap0);
      raceData.lapTimes.forEach(lap => {
        lap.forEach(curLap => {
          if( curLap.driverId == driver.driverId ){
            var pitstop = raceData.pitStops.filter(pitstop => pitstop.driverId == driver.driverId && pitstop.lap == curLap.lap);
            var endResult = raceData.results.filter(res => res.driverId == driver.driverId && res.laps == curLap.lap);
            if(pitstop.length > 0){
              curLap.pitStop = pitstop[0];
            }
            if(endResult.length > 0){
              curLap.finished = endResult[0];
            }
            lapData.laps.push(curLap);
          }
        });
      });
      lapData.laps.sort((o1,o2) => o1["lap"] - o2["lap"]);
      result.push(lapData);
    });

    return result;
  },

  getRacesByYear: function(year) {
    var races = queries.getRacesByYear(year);
    var racesUnsorted = races.map(race => processor.getRace(race.raceId));
    racesUnsorted.sort((o1,o2) => o1["raceInfo"]["round"] - o2["raceInfo"]["round"]);
    return racesUnsorted;
  },

  //Gets the position of Driver with driverid in specific lap
  // lapData: an array of the lap data for one lap
  getPositionOfDriver: function(driver, lapData, defaultReturn){
    var lapEntryWithDrivId = lapData.filter( drivLap => drivLap.driverId == driver.driverId );
    if(lapEntryWithDrivId.length > 0){
      return lapEntryWithDrivId[0].position;
    }else{
      return defaultReturn;
    }
  },

  getQualifyingForDriver: function(raceData, driver){
    var qualData = raceData.qualifying.filter( qualData => qualData.driverId == driver.driverId);
    return qualData[0];
  },
  
  getSeasonsWithLapData: function(){
    var seasons = queries.getSeasons();
    var raceIds = queries.getRaceIdWithLapTimes();
    var races = queries.getRaces().filter(race => raceIds.includes(race.raceId));
    
    var seasonsWithLapData = seasons.filter((season) => races.filter(race => race.year == season.year).length > 0).reduce(removeDuplicates,[]);
    seasonsWithLapData.sort((o1,o2) => o1["year"] - o2["year"]);
    return seasonsWithLapData;
  }

};
