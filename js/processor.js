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
                lapData.laps.push({'driverId': driver.driverId, 'lap': 0, 'position': lapData.qualifying.position})
                raceData.lapTimes.forEach(lap => {
                    lap.forEach(curLap => {
                        if( curLap.driverId == driver.driverId ){
                             var pitstop = raceData.pitStops.filter(pitstop => pitstop.driverId == driver.driverId && pitstop.lap == curLap.lap);
                             if(pitstop.length > 0){
                                curLap.pitStop = pitstop[0];
                             }
                             lapData.laps.push(curLap);
                        }
                    });
                });
                result.push(lapData);
            });
            return result;
      },

  getRacesByYear: function(year) {
    var races = queries.getRacesByYear(year);
    return races.map(race => processor.getRace(race.raceId));
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
  }

};
