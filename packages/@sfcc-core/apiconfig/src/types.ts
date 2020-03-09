export type AvailableConfigProperties =
    | 'COMMERCE_API_PATH'
    | 'COMMERCE_CLIENT_API_SITE_ID'
    | 'COMMERCE_CLIENT_CLIENT_ID'
    | 'COMMERCE_CLIENT_REALM_ID'
    | 'COMMERCE_CLIENT_INSTANCE_ID'
    | 'COMMERCE_CLIENT_ORGANIZATION_ID'
    | 'COMMERCE_CLIENT_SHORT_CODE'
    | 'COMMERCE_SESSION_SECRET'
    | 'COMMERCE_LOG_LEVEL';

export type Config = {
    [key in AvailableConfigProperties]: string;
};
