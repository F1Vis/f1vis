"use strict";

var processor = {

  getRace: function(raceId) {
    var race =  {
      drivers: null,  
      lapTimes: null,
      pitStops: null,
      qualifying: null,
      results: null
    };
    
    race.drivers = queries.getDriversByRaceId(raceId);
    race.lapTimes = queries.getLapDataByRaceId(raceId);
    race.qualifying = queries.getQualifingDataByRaceId(raceId);
    race.pitStops = queries.getPitStopsByRaceId(raceId);
    race.results = queries.getResultsByRaceId(raceId);

    return race;
  },
};
