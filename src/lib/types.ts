export interface CapitalComCreateSessionResponse {
    accountType?: string;
    accountInfo?: AccountInfo;
    currencyIsoCode?: string;
    currencySymbol?: string;
    currentAccountId?: string;
    streamingHost?: string;
    accounts?: (Account)[];
    clientId?: string;
    timezoneOffset?: number;
    hasActiveDemoAccounts?: boolean;
    hasActiveLiveAccounts?: boolean;
    trailingStopsEnabled?: boolean;
    errorCode?: string;
}

export interface AccountInfo {
    balance: number;
    deposit: number;
    profitLoss: number;
    available: number;
}

export interface Account {
    accountId: string;
    accountName: string;
    preferred: boolean;
    accountType: string;
    demo?: boolean;
}

export interface CapitalComTradeHistoryResponse {
    activities?: Activity[];
    errorCode?: string;
}
  
export interface Activity {
    date: string
    dateUTC: string
    epic: string
    dealId: string
    source: string
    type: string
    status: string
}
  

export interface CapitalComTradeDetailsResponse {
    position?: Position;
    market?: Market;
    errorCode?: string;
}
  
export interface Position {
    contractSize: number;
    createdDate: string;
    createdDateUTC: string;
    dealId: string;
    dealReference: string;
    workingOrderId: string;
    size: number;
    leverage: number;
    upl: number;
    direction: "BUY" | "SELL";
    level: number;
    currency: string;
    guaranteedStop: boolean;
}
  
export interface Market {
    instrumentName: string;
    expiry: string;
    marketStatus: string;
    epic: string;
    instrumentType: string;
    lotSize: number;
    high: number;
    low: number;
    percentageChange: number;
    netChange: number;
    bid: number;
    offer: number;
    updateTime: string;
    updateTimeUTC: string;
    delayTime: number;
    streamingPricesAvailable: boolean;
    scalingFactor: number;
}

export interface CapitalComPingResponse {
    status?: "ok" | string,
    errorCode?: string
}

export interface CapitalComUserAccounts {
    accounts?: Account[];
    errorCode?: string
}
  
export interface Account {
    accountId: string
    accountName: string
    status: string
    accountType: string
    preferred: boolean
    balance: Balance
    currency: string
}
  
export interface Balance {
    balance: number
    deposit: number
    profitLoss: number
    available: number
}

export interface SwitchAccountsResponse {
    trailingStopsEnabled?: boolean
    dealingEnabled?: boolean
    hasActiveDemoAccounts?: boolean
    hasActiveLiveAccounts?: boolean
    errorCode?: string
}

export type BaseAPIURLType = "https://api-capital.backend-capital.com" | "https://demo-api-capital.backend-capital.com" | ""

export interface SelectUserAPIRequestBody {
    isDemo: boolean;
    selectedAccount: string;
}

export interface AccountBalanceObject {
    balance?: number;
    profitloss?: number;
    available?: number;
    currency?: string;
    error?: string;
};
