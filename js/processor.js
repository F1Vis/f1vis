"use strict";

var processor = {

  getRace: function(raceId) {
    var race =  {
      drivers: null,
      lapTimes: null,
      pitStops: null,
      qualifying: null,
      results: null,
      raceInfo: null
    };

    race.drivers = queries.getDriversByRaceId(raceId);
    race.lapTimes = queries.getLapDataByRaceId(raceId);
    race.qualifying = queries.getQualifingDataByRaceId(raceId);
    race.pitStops = queries.getPitStopsByRaceId(raceId);
    race.results = queries.getResultsByRaceId(raceId);
    race.raceInfo = queries.getRaceById(raceId);

    return race;
  },

  getRacesByYear: function(year) {
    var races = queries.getRacesByYear(year);
    return races.map(race => processor.getRace(race.raceId));
  },

  //Gets the position of Driver with driverid in specific lap
  getPositionOfDriver: function(driver, lap, defaultReturn){
    var lapEntryWithDrivId =lap.filter( drivLap => drivLap.driverId == driver.driverId );
    if(lapEntryWithDrivId.length > 0){
      return lapEntryWithDrivId[0].position;
    }else{
      return defaultReturn;
    }
  },

};
