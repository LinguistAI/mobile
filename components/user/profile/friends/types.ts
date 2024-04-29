import React from 'react';

export enum EMenuOption {
  REMOVE = 'Remove Friend',
}

export type EMenuOptionObject = {
  label: string;
  value: any; // TODO test TODO cannot display myself as friend
  icon: React.ReactElement;
};

export enum EIncomingMenuOption {
  ACCEPT = 'Accept Request',
  REJECT = 'Reject Request',
}

export enum ECancelMenuOption {
  CANCEL = 'Cancel Request',
}
