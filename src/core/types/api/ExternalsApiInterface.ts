/**
 * GetIpData API response
 */
export type GetIpDataResponseIC = {
  success: boolean;
  ip: string;
  type: string;
  country: {
    code: string;
    name: string;
  };
  region: string;
  city: string;
  location: {
    lat: number;
    lon: number;
  };
  timeZone: string;
  asn: {
    number: number;
    name: string;
    network: string;
  };
};
