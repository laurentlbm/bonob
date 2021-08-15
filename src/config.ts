import { hostname } from "os";
import logger from "./logger";
import url from "./url_builder";

export default function () {
  const port = +(process.env["BONOB_PORT"] || 4534);
  const bonobUrl =
    process.env["BONOB_URL"] ||
    process.env["BONOB_WEB_ADDRESS"] ||
    `http://${hostname()}:${port}`;

  if (bonobUrl.match("localhost")) {
    logger.error(
      "BONOB_URL containing localhost is almost certainly incorrect, sonos devices will not be able to communicate with bonob using localhost, please specify either public IP or DNS entry"
    );
    process.exit(1);
  }

  return {
    port,
    bonobUrl: url(bonobUrl),
    secret: process.env["BONOB_SECRET"] || "bonob",
    sonos: {
      serviceName: process.env["BONOB_SONOS_SERVICE_NAME"] || "bonob",
      deviceDiscovery:
        (process.env["BONOB_SONOS_DEVICE_DISCOVERY"] || "true") == "true",
      seedHost: process.env["BONOB_SONOS_SEED_HOST"],
      autoRegister:
        (process.env["BONOB_SONOS_AUTO_REGISTER"] || "true") == "true",
      sid: Number(process.env["BONOB_SONOS_SERVICE_ID"] || "246"),
    },
    navidrome: {
      url: process.env["BONOB_NAVIDROME_URL"] || `http://${hostname()}:4533`,
      customClientsFor:
        process.env["BONOB_NAVIDROME_CUSTOM_CLIENTS"] || undefined,
    },
    scrobbleTracks: (process.env["BONOB_SCROBBLE_TRACKS"] || "true") == "true",
    reportNowPlaying:
      (process.env["BONOB_REPORT_NOW_PLAYING"] || "true") == "true",
  };
}
