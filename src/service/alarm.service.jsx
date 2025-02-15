import {
  URL_ALARM_ACK,
  URL_ALARM_ALL,
  URL_ALARM_HISTORY,
  URL_ALARM_REALTIME,
} from "../redux/URL";
import AxiosAuthor from "../utils/AxiosAuthor";

const AlarmService = {
  fetchRealTime: async ({ stationId }) => {
    var data = await AxiosAuthor.post(URL_ALARM_REALTIME, {
      stationId: stationId,
    });
    return data.data;
  },
  fetchHistorical: async ({ stationId, fromTime, toTime }) => {
    var data = await AxiosAuthor.post(URL_ALARM_HISTORY, {
      fromTime: fromTime,
      toTime: toTime,
      stationId: stationId,
    });
    return data.data;
  },
  ackAlarm: async (stationId, alarmName, alarmType, incommingTime, comment) => {
    alert(
      stationId +
        "\t " +
        alarmName +
        "\t " +
        alarmType +
        "\t " +
        incommingTime +
        "\t" +
        comment
    );

    var data = await AxiosAuthor.post(URL_ALARM_ACK, {
      stationId: stationId,
      alarmName: alarmName,
      alarmType: alarmType,
      incommingTime: incommingTime,
      comment: comment,
    });
    alert(JSON.stringify(data.data))
    return data.data;
  },

  ackAllAlarm: async (stationId) => {
    var data = await AxiosAuthor.post(URL_ALARM_ALL, {
      stationId: stationId,
    });
    return data.data;
  },
};
export default AlarmService;
