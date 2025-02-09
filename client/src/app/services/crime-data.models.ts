export interface Incident {
  IncidentDate: string;
  OccurredFromTime: string;
  IncidentNum: number;
  Offense: string;
  NIBRS: string;
  NIBRSCategory: string;
  SRS_UCR: string;
  CrimeAgainst: string;
  FelMisdCit: string;
  IncidentTopSRS_UCR: string;
  IncidentLocation: string;
  IntersectionOtherLoc: string | null;
  District: string;
  Neighborhood: string;
  NbhdNum: string;
  Latitude: string;
  Longitude: string;
  IncidentSupplemented: string;
  LastSuppDate: string | null;
  VictimNum: string;
  FirearmUsed: string;
  IncidentNature: string;
}
