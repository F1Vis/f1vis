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
  }
};
