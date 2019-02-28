/*
 * Copyright (C) 2016 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable */
export function AddressFormat() {
    'use strict';
    
    var data = {
        'AE': {
            'fmt': '%A%n%S%n%K',
            'require': 'AS',
            'input': 'ASK'
        },
        'AL': {
            'fmt': '%A%n%Z%n%C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'EC': {
            '_ref': 'AL'
        },
        'MU': {
            '_ref': 'AL'
        },
        'OM': {
            '_ref': 'AL'
        },
        'AM': {
            'fmt': '%A%n%Z%n%C%n%S%n%K',
            'require': 'AZCS',
            'input': 'AZK'
        },
        'AR': {
            'fmt': '%A%n%Z %C%n%S%n%K',
            'require': 'AZCS',
            'input': 'AZCSK'
        },
        'CL': {
            '_ref': 'AR'
        },
        'CV': {
            '_ref': 'AR'
        },
        'MY': {
            '_ref': 'AR'
        },
        'UZ': {
            '_ref': 'AR'
        },
        'AT': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'BA': {
            '_ref': 'AT'
        },
        'BG': {
            '_ref': 'AT'
        },
        'CH': {
            '_ref': 'AT'
        },
        'DE': {
            '_ref': 'AT'
        },
        'DK': {
            '_ref': 'AT'
        },
        'DO': {
            '_ref': 'AT'
        },
        'DZ': {
            '_ref': 'AT'
        },
        'EE': {
            '_ref': 'AT'
        },
        'ET': {
            '_ref': 'AT'
        },
        'FR': {
            '_ref': 'AT'
        },
        'GE': {
            '_ref': 'AT'
        },
        'GR': {
            '_ref': 'AT'
        },
        'IL': {
            '_ref': 'AT'
        },
        'KW': {
            '_ref': 'AT'
        },
        'LA': {
            '_ref': 'AT'
        },
        'LR': {
            '_ref': 'AT'
        },
        'IS': {
            '_ref': 'AT'
        },
        'MA': {
            '_ref': 'AT'
        },
        'MG': {
            '_ref': 'AT'
        },
        'MK': {
            '_ref': 'AT'
        },
        'MZ': {
            '_ref': 'AT'
        },
        'NL': {
            '_ref': 'AT'
        },
        'NO': {
            '_ref': 'AT'
        },
        'PL': {
            '_ref': 'AT'
        },
        'PT': {
            '_ref': 'AT'
        },
        'PY': {
            '_ref': 'AT'
        },
        'RO': {
            '_ref': 'AT'
        },
        'RS': {
            '_ref': 'AT'
        },
        'SK': {
            '_ref': 'AT'
        },
        'TJ': {
            '_ref': 'AT'
        },
        'TN': {
            '_ref': 'AT'
        },
        'TZ': {
            '_ref': 'AT'
        },
        'WF': {
            '_ref': 'AT'
        },
        'AU': {
            'fmt': '%A%n%C %S %Z%n%K',
            'require': 'ACSZ',
            'input': 'ACSZK'
        },
        'CA': {
            '_ref': 'AU'
        },
        'AZ': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'AF': {
            'fmt': '%A%n%C%n%Z%n%K',
            'require': 'ACZ',
            'input': 'ACZK'
        },
        'FK': {
            '_ref': 'AF'
        },
        'GB': {
            'fmt': '%A%n%C%n%Z%n%S%n%K',
            'require': 'ACZ',
            'input': 'ACZK'
        },
        'KE': {
            '_ref': 'AF'
        },
        'LK': {
            '_ref': 'AF'
        },
        'ZA': {
            '_ref': 'AF'
        },
        'SH': {
            '_ref': 'AF'
        },
        'SZ': {
            '_ref': 'AF'
        },
        'US': {
            'fmt': '%A%n%C, %S %Z%n%K',
            'require': 'ACSZ',
            'input': 'ACSZK'
        },
        'BB': {
            '_ref': 'US'
        },
        'BS': {
            '_ref': 'US'
        },
        'SO': {
            '_ref': 'US'
        },
        'ES': {
            'fmt': '%A%n%Z %C %S%n%K',
            'require': 'AZCS',
            'input': 'AZCSK'
        },
        'IT': {
            '_ref': 'ES'
        },
        'UY': {
            '_ref': 'ES'
        },
        'ID': {
            'fmt': '%A%n%C%n%S %Z%n%K',
            'require': 'ACSZ',
            'input': 'ACSZK'
        },
        'IE': {
            '_ref': 'ID'
        },
        'TH': {
            '_ref': 'ID'
        },
        'VN': {
            '_ref': 'ID'
        },
        'HU': {
            'fmt': '%C%n%A%n%Z%n%K',
            'require': 'CAZ',
            'input': 'CAZK'
        },
        'BH': {
            'fmt': '%A%n%C %Z%n%K',
            'require': 'ACZ',
            'input': 'ACZK'
        },
        'BM': {
            '_ref': 'BH'
        },
        'BN': {
            '_ref': 'BH'
        },
        'BT': {
            '_ref': 'BH'
        },
        'KH': {
            '_ref': 'BH'
        },
        'LB': {
            '_ref': 'BH'
        },
        'JO': {
            '_ref': 'BH'
        },
        'MT': {
            '_ref': 'BH'
        },
        'NP': {
            '_ref': 'BH'
        },
        'NZ': {
            '_ref': 'BH'
        },
        'SA': {
            '_ref': 'BH'
        },
        'BD': {
            'fmt': '%A%n%C - %Z%n%K',
            'require': 'ACZ',
            'input': 'ACZK'
        },
        'BR': {
            'fmt': '%A%n%C-%S%n%Z%n%K',
            'require': 'ACSZ',
            'input': 'ACSZK'
        },
        'CN': {
            'fmt': '%K%n%S %C%n%A%n%Z',
            'require': 'CAZ',
            'input': 'KSCAZ'
        },
        'HK': {
            'fmt': '%K%C%n%A%n',
            'require': 'CA',
            'input': 'KCA'
        },
        'CO': {
            'fmt': '%A%n%C, %S, %Z%n%K',
            'require': 'ACSZ',
            'input': 'ACSZK'
        },
        'CR': {
            'fmt': '%A%n%S, %C%n%Z%n%K',
            'require': 'ACSZ',
            'input': 'ASCZK'
        },
        'EG': {
            'fmt': '%A%n%C%n%S%n%Z%n%K',
            'require': 'ACSZ',
            'input': 'ACSZK'
        },
        'RU': {
            '_ref': 'EG'
        },
        'UA': {
            '_ref': 'EG'
        },
        'FI': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'GT': {
            'fmt': '%A%n%Z-%C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'HN': {
            'fmt': '%A%n%C, %S%n%Z%n%K',
            'require': 'ACSZ',
            'input': 'ACSZK'
        },
        'IQ': {
            '_ref': 'HN'
        },
        'HR': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'HT': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'IN': {
            'fmt': '%A%n%C %Z%n%S%n%K',
            'require': 'ACZS',
            'input': 'ACZSK'
        },
        'NG': {
            '_ref': 'IN'
        },
        'PE': {
            '_ref': 'IN'
        },
        'IR': {
            'fmt': '%S%n%C%n%A%n%Z%n%K',
            'require': 'SCAZ',
            'input': 'SCAZK'
        },
        'JM': {
            'fmt': '%A%n%C%n%S%n%K',
            'require': 'ACS',
            'input': 'ACSK'
        },
        'PA': {
            '_ref': 'JM'
        },
        'SC': {
            '_ref': 'JM'
        },
        'SR': {
            '_ref': 'JM'
        },
        'JP': {
            'fmt': '%K%n〒%Z%n%S %C%n%A',
            'require': 'ZCA',
            'input': 'KZSCA'
        },
        'EN_JP': {
            'fmt': '%A%n%C %S%n%Z %K',
            'require': 'ACSZ',
            'input': 'ACSZK'
        },
        'KG': {
            'fmt': '%Z %C%n%A%n%S%n%K',
            'require': 'ZCA',
            'input': 'ZCAK'
        },
        'KR': {
            'fmt': '%S %C%n%A%n%Z%n%K',
            'require': 'SCAZ',
            'input': 'SCAZK'
        },
        'KY': {
            'fmt': '%A%n%S %Z%n%K',
            'require': 'ASZ',
            'input': 'ASZK'
        },
        'KZ': {
            'fmt': '%Z%n%S%n%C%n%A%n%K',
            'require': 'ZSCA',
            'input': 'ZSCAK'
        },
        'LT': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'LV': {
            'fmt': '%A%n%C, %Z%n%K',
            'require': 'ACZ',
            'input': 'ACZK'
        },
        'MM': {
            '_ref': 'LV'
        },
        'MC': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'MD': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'MW': {
            'fmt': '%A%n%C%n%K',
            'require': 'AC',
            'input': 'ACK'
        },
        'MX': {
            'fmt': '%A%n%Z %C, %S%n%K',
            'require': 'AZCS',
            'input': 'AZCSK'
        },
        'NI': {
            'fmt': '%A%n%Z%n%C, %S%n%K',
            'require': 'AZCS',
            'input': 'AZCSK'
        },
        'PG': {
            'fmt': '%A%n%C %Z %S%n%K',
            'require': 'ACZS',
            'input': 'ACZSK'
        },
        'PH': {
            'fmt': '%A, %C%n%Z %S%n%K',
            'require': 'ACZS',
            'input': 'ACZSK'
        },
        'PK': {
            'fmt': '%A%n%C-%Z%n%K',
            'require': 'ACZ',
            'input': 'ACZK'
        },
        'PR': {
            'fmt': '%A%n%C %Z%n%K',
            'require': 'ACZ',
            'input': 'ACZK'
        },
        'SE': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'SG': {
            'fmt': '%A%n%C %Z%n%S%n%K',
            'require': 'AZ',
            'input': 'AZK'
        },
        'SI': {
            'fmt': '%A%n%Z %C%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'SV': {
            'fmt': '%A%n%Z-%C%n%S%n%K',
            'require': 'AZCS',
            'input': 'AZCSK'
        },
        'TR': {
            'fmt': '%A%n%Z %C/%S%n%K',
            'require': 'AZC',
            'input': 'AZCK'
        },
        'TW': {
            'fmt': '%K%n%Z%n%S %C%n%A',
            'require': 'ZSCA',
            'input': 'KZSCA'
        },
        'VE': {
            'fmt': '%A%n%C %Z, %S%n%K',
            'require': 'ACZS',
            'input': 'ACZSK'
        }
    };
    
    var languageCodeToCountry = {
        'languageCode': {
            'ar': 'AE',
            'bg': 'BG',
            'bn': 'BN',
            'bs': 'BA',
            'ca': 'ES',
            'cs': 'CZ',
            'cy': 'GB',
            'da': 'DK',
            'de': 'DE',
            'el': 'GR',
            'es': 'ES',
            'et': 'ET',
            'eu': 'ES',
            'fi': 'FI',
            'fr': 'FR',
            'ga': 'IE',
            'hi': 'HI',
            'hr': 'HR',
            'hu': 'HU',
            'hy': 'HY',
            'in': 'ID',
            'is': 'IS',
            'it': 'IT',
            'iw': 'IL',
            'ja': 'JP',
            'ka': 'GE',
            'ko': 'KR',
            'lb': 'LU',
            'lt': 'IT',
            'lv': 'LV',
            'mk': 'MK',
            'ms': 'MY',
            'mt': 'MT',
            'nl': 'NL',
            'no': 'NO',
            'pl': 'PL',
            'pt': 'PT',
            'rm': 'DE',
            'ro': 'RO',
            'ru': 'RU',
            'sh': 'BA',
            'sk': 'SK',
            'sl': 'SL',
            'sq': 'SQ',
            'sr': 'RS',
            'sv': 'SE',
            'ta': 'TA',
            'th': 'TH',
            'tl': 'PH',
            'tr': 'TR',
            'uk': 'UK',
            'ur': 'UR',
            'vi': 'VN',
            'zh': 'CN'
        }
    };
    
    /**
     * Define address format patterns.
     */
    var AddressFormatPattern = Object.freeze({
        /**
         *
         * N: Name (The formatting of names for this field is outside of the scope of the address elements.)
         * O: Organization
         * A: Address Lines (2 or 3 lines address)
         * D: District (Sub-locality): smaller than a city, and could be a neighborhood, suburb or dependent locality.
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * X: Sorting code, for example, CEDEX as used in France
         * n: newline
         */
        A: Symbol('Address Lines'),
        C: Symbol('City'),
        S: Symbol('State'),
        K: Symbol('Country'),
        Z: Symbol('Zip Code'),
        n: Symbol('New Line'),
        fromPlaceHolder: function fromPlaceHolder(placeHolder) {
            switch (placeHolder) {
                case 'A':
                    return AddressFormatPattern.A;
                case 'C':
                    return AddressFormatPattern.C;
                case 'S':
                    return AddressFormatPattern.S;
                case 'K':
                    return AddressFormatPattern.K;
                case 'Z':
                    return AddressFormatPattern.Z;
                case 'n':
                    return AddressFormatPattern.n;
            }
            return null;
        },
        getPlaceHolder: function getPlaceHolder(pattern) {
            switch (pattern) {
                case AddressFormatPattern.A:
                    return 'A';
                case AddressFormatPattern.C:
                    return 'C';
                case AddressFormatPattern.S:
                    return 'S';
                case AddressFormatPattern.K:
                    return 'K';
                case AddressFormatPattern.Z:
                    return 'Z';
                case AddressFormatPattern.n:
                    return 'n';
            }
            return null;
        },
        getData: function getData(pattern, data) {
            if (data) {
                switch (pattern) {
                    case AddressFormatPattern.A:
                        return data.address;
                    case AddressFormatPattern.C:
                        return data.city;
                    case AddressFormatPattern.S:
                        return data.state;
                    case AddressFormatPattern.K:
                        return data.country;
                    case AddressFormatPattern.Z:
                        return data.zipCode;
                    case AddressFormatPattern.n:
                        return data.newLine;
                }
            }
            return null;
        }
    });
    
    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    
    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
    
      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    
    /**
     * Address token types enum
     *
     * @private
     */
    var AddressTokenTypes = Object.freeze({
        DATA: Symbol('data'),
        STRING: Symbol('string'),
        NEWLINE: Symbol('newline'),
        GROUP: Symbol('group')
    });
    
    /**
     * AddressToken class
     *
     * @private
     */
    
    var AddressToken = function () {
        /**
         *
         * @param {AddressTokenTypes} type
         * @param {string} string
         * @param {*} pattern
         */
        function AddressToken(type, string, pattern) {
            classCallCheck(this, AddressToken);
    
            this.type = type;
            this.string = string;
            this.pattern = pattern;
        }
    
        /**
         * Construct a string type token
         *
         * @param {string} string String
         * @return {AddressToken} Address Token
         */
    
    
        createClass(AddressToken, null, [{
            key: 'string',
            value: function string(_string) {
                return new AddressToken(AddressTokenTypes.STRING, _string);
            }
            /**
             * Construct a data type token
             *
             * @param {pattern} pattern Address Format Pattern
             * @return {AddressToken} Address Token
             */
    
        }, {
            key: 'data',
            value: function data(pattern) {
                return new AddressToken(AddressTokenTypes.DATA, undefined, pattern);
            }
            /**
             * Construct a new line type token
             *
             * @return {AddressToken} Address Token
             */
    
        }, {
            key: 'newLine',
            value: function newLine() {
                return new AddressToken(AddressTokenTypes.NEWLINE);
            }
        }]);
        return AddressToken;
    }();
    
    /**
     * TokenizerState class
     *
     * @private
     */
    
    
    var TokenizerState =
    /**
     * Constructor
     *
     * @param {string} pattern
     * @param {int} start
     */
    function TokenizerState(pattern, start) {
        classCallCheck(this, TokenizerState);
    
        this.pattern = pattern;
        this.start = start;
    };
    
    /**
     * Tokenize string pattern to AddressToken array
     *
     * @param {TokenizerState} state
     * @param {AddressToken[]} tokens
     * @return {TokenizerState} Tokenizer state
     *
     * @private
     */
    
    
    function tokenize(state, tokens) {
        var nextIndex = state.start;
        if (state.pattern) {
            var len = state.pattern.length;
            while (state.start < len) {
                nextIndex = state.pattern.indexOf('%', nextIndex);
                if (nextIndex >= 0 && nextIndex + 1 < len) {
                    var placeHolder = state.pattern.substring(nextIndex + 1, nextIndex + 2);
                    switch (placeHolder) {
                        case 'n':
                            {
                                if (nextIndex - state.start > 0) {
                                    tokens.push(AddressToken.string(state.pattern.substring(state.start, nextIndex)));
                                }
                                tokens.push(AddressToken.newLine());
                                state.start = nextIndex + 2;
                                nextIndex = state.start;
                                break;
                            }
                        default:
                            {
                                var p = AddressFormatPattern.fromPlaceHolder(placeHolder);
                                if (p) {
                                    if (nextIndex - state.start > 0) {
                                        tokens.push(AddressToken.string(state.pattern.substring(state.start, nextIndex)));
                                    }
                                    tokens.push(AddressToken.data(p));
                                    state.start = nextIndex + 2;
                                    nextIndex = state.start;
                                } else {
                                    state.start = nextIndex + 2;
                                    nextIndex = state.start;
                                }
                                break;
                            }
                    }
                } else {
                    if (state.start < len) {
                        tokens.push(AddressToken.string(state.pattern.substring(state.start)));
                    }
                    state.start = len;
                }
            }
        }
        return state;
    }
    
    /**
     * Format line from tokens
     *
     * @param {*} tokens
     * @param {*} data
     * @param {*} ignoreEmptyLines
     * @param {*} firstIndex
     * @param {*} lastIndex
     * @return {string} Formatted line
     *
     * @private
     */
    function formatLineTokens(tokens, data, ignoreEmptyLines, firstIndex, lastIndex) {
        var parts = [];
        for (var index = firstIndex; index <= lastIndex; index++) {
            var token = tokens[index];
            if (!token) {
                continue;
            } else if (token.type == AddressTokenTypes.DATA) {
                // Consume all subsequent data if available
                var dataBuffer = '';
                var lastDataIndex = index;
                for (var dataIndex = index; dataIndex <= lastIndex; dataIndex++) {
                    var dataToken = tokens[dataIndex];
                    if (!dataToken || dataToken.type != AddressTokenTypes.DATA) {
                        break;
                    }
                    var fieldData = AddressFormatPattern.getData(dataToken.pattern, data);
                    if (fieldData) {
                        dataBuffer += fieldData;
                        lastDataIndex = dataIndex;
                    }
                }
                var hasData = dataBuffer && dataBuffer.length > 0;
                // Output previous string only if there is data before it,
                // or if it is the first on the line
                var hasPreviousData = false;
                if (index - 1 >= firstIndex) {
                    var stringToken = tokens[index - 1];
                    if (stringToken && stringToken.type == AddressTokenTypes.STRING && stringToken.string) {
                        for (var prevIndex = index - 2; prevIndex >= firstIndex; prevIndex--) {
                            var prevToken = tokens[prevIndex];
                            if (prevToken && prevToken.type == AddressTokenTypes.DATA) {
                                var _fieldData = AddressFormatPattern.getData(prevToken.pattern, data);
                                if (_fieldData) {
                                    hasPreviousData = true;
                                    break;
                                }
                            } else if (prevToken && prevToken.type == AddressTokenTypes.STRING) {
                                // ie. for "%C, %S %Z" without S -> "City, 95100"
                                // Comment this if we want "City 95100" instead
                                // (use the separator between S Z instead of C S)
                                stringToken = prevToken;
                            }
                        }
                        if (!ignoreEmptyLines || hasPreviousData && hasData || index - 1 == firstIndex && hasData) {
                            parts.push(stringToken.string);
                        }
                    }
                }
                if (hasData) {
                    parts.push(dataBuffer);
                }
                index = lastDataIndex;
                // Output next string only if it is the last
                // and there is previous data before it
                if (index + 1 == lastIndex) {
                    var _stringToken = tokens[index + 1];
                    if (_stringToken && _stringToken.type == AddressTokenTypes.STRING && _stringToken.string) {
                        if (!ignoreEmptyLines || hasData || hasPreviousData) {
                            parts.push(_stringToken.string);
                        }
                    }
                    // Consume the last string token
                    index = index + 1;
                }
            } else {
                // We should not get here
            }
        }
        return parts.join('').trim();
    }
    
    /**
     * Tokenize address format pattern.
     *
     * @param {AddressToken[]} tokens
     * @param {*} data
     * @param {string} lineBreak
     * @param {boolean} ignoreEmptyLines
     * @return {string} Formatted Address
     *
     * @private
     */
    function formatTokens(tokens, data, lineBreak, ignoreEmptyLines) {
        var lines = [];
        var lineIndex = -1;
        for (var index = 0; index < tokens.length; index++) {
            var doFormat = false;
            var endWithNewLine = false;
            var token = tokens[index];
            switch (token.type) {
                case AddressTokenTypes.NEWLINE:
                    {
                        if (lineIndex >= 0) {
                            doFormat = true;
                            endWithNewLine = true;
                        } else if (!ignoreEmptyLines) {
                            lines.push(''); // Empty line
                            // If the pattern ends with a newline
                            if (index + 1 == tokens.length) {
                                lines.push(''); // Empty line
                            }
                        }
                        break;
                    }
                default:
                    {
                        lineIndex = lineIndex < 0 ? index : lineIndex;
                        doFormat = index + 1 == tokens.length ? true : doFormat;
                        break;
                    }
            }
            if (doFormat) {
                var line = formatLineTokens(tokens, data, ignoreEmptyLines, lineIndex, endWithNewLine ? index - 1 : index);
                if (!ignoreEmptyLines || line) {
                    lines.push(line);
                }
                // If line ends with a newline, and it is the last line on pattern
                if (!ignoreEmptyLines && endWithNewLine && index + 1 == tokens.length) {
                    lines.push('');
                }
                lineIndex = -1;
            }
        }
        return lines.join(lineBreak);
    }
    
    /**
     * Format address data.
     *
     * @param {*} data Address data being processed.
     * @param {string} pattern Address format pattern.
     * @param {string} lineBreak Line break string to use
     * @param {boolean} ignoreEmptyLines Ignore lines that has no or empty data to replace.
     * @return {string} Formatted address.
     */
    function format(data, pattern, lineBreak, ignoreEmptyLines) {
        // TODO: support escapeHtml to match Java class feature parity
        ignoreEmptyLines = ignoreEmptyLines === false ? false : true; // Defaults to false
        lineBreak = lineBreak || '\n'; // Defaults to <br/> or lf
        var tokens = [];
        tokenize(new TokenizerState(pattern, 0), tokens);
        return formatTokens(tokens, data, lineBreak, ignoreEmptyLines);
    }
    
    var addressFormatter = { format: format };
    
    var CJK_COUNTRIES = ['CN', 'HK', 'TW', 'JP', 'KR', 'KP'];
    var CJK_LANGUAGES = ['zh', 'ja', 'ko'];
    
    var address = {
        /**
         * Gets the globalization for the specified country code.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {{fmt: string, input: string, require: string}} Format Data
         */
        getAddressInfoForCountry: function getAddressInfoForCountry(langCode, countryCode) {
            var code = this.getCountryFromLocale(langCode, countryCode);
            if (data[code]) {
                // Double check.
                var cloneAddressRep = Object.freeze(Object.assign({}, data[code]));
                return Object.freeze({
                    address: cloneAddressRep
                });
            }
            return {};
        },
    
    
        /**
         * Get the format pattern.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {string} Address Format Pattern
         */
        getAddressFormat: function getAddressFormat(langCode, countryCode) {
            var code = this.getCountryFromLocale(langCode, countryCode);
            if (data[code]) {
                // Double check.
                return data[code].fmt;
            }
            return '';
        },
    
    
        /**
         * Get the input order pattern.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {string} Input Order
         */
        getAddressInputOrder: function getAddressInputOrder(langCode, countryCode) {
            var code = this.getCountryFromLocale(langCode, countryCode);
            if (data[code]) {
                // Double check.
                return data[code].input;
            }
            return '';
        },
    
    
        /**
         * Get the input order pattern for all fields.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {string} Input Order
         */
        getAddressInputOrderAllField: function getAddressInputOrderAllField(langCode, countryCode) {
            var code = this.getCountryFromLocale(langCode, countryCode);
            if (data[code]) {
                // Double check.
                var input = data[code].input;
    
                // Add missing patterns.
                if (input.indexOf('S') === -1) {
                    input = input.replace('K', 'SK');
                }
                if (input.indexOf('C') === -1) {
                    input = input.replace('S', 'CS');
                }
                if (input.indexOf('Z') === -1) {
                    input = input.replace('C', 'ZC');
                }
    
                return input;
            }
            return '';
        },
    
    
        /**
         * Get required fields.
         * A: Address Lines (2 or 3 lines address)
         * C: City (Locality)
         * S: State (Administrative Area)
         * K: Country
         * Z: ZIP Code / Postal Code
         * n: newline
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @return {string} Required Fields
         */
        getAddressRequireFields: function getAddressRequireFields(langCode, countryCode) {
            var code = this.getCountryFromLocale(langCode, countryCode);
            if (data[code]) {
                // Double check.
                return data[code].require;
            }
            return '';
        },
    
    
        /**
         * Format a address values for given language code and country code with specified line break.
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values Actual Address Data
         * @param {string} lineBreak Line Break
         * @return {string} Formatted Address
         */
        formatAddressAllFields: function formatAddressAllFields(langCode, countryCode, values, lineBreak) {
            var code = this.getCountryFromLocale(langCode, countryCode, values);
            if (data[code]) {
                // Double check.
                var pattern = data[code].fmt;
                // Some countries don't have City, State or ZIP code. We don't want to
                // lose those data from formatted string.
                if (values.zipCode && pattern.indexOf('%Z') === -1) {
                    pattern = pattern.replace('%K', '%Z %K');
                }
                if (values.city && pattern.indexOf('%C') === -1) {
                    pattern = pattern.replace('%K', '%C %K');
                }
                if (values.state && pattern.indexOf('%S') === -1) {
                    pattern = pattern.replace('%K', '%S %K');
                }
                return this.buildAddressLines(pattern, values, lineBreak, true);
            }
            return '';
        },
    
    
        /**
         * Format a address values for given language code and country code with specified line break.
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values Actual Address Data
         * @param {string} lineBreak Line Break
         * @return {string} Formatted Address
         */
        formatAddress: function formatAddress(langCode, countryCode, values, lineBreak) {
            var code = this.getCountryFromLocale(langCode, countryCode, values);
            if (data[code]) {
                // Double check.
                return this.buildAddressLines(data[code].fmt, values, lineBreak, true);
            }
            return '';
        },
    
    
        /**
         * Creates an array of address lines given the format and the values to use.
         *
         * @param {string} pattern
         * @param {{address: string, country: string, city: string, state: string, zipCode: string}} values
         * @param {string} lineBreak
         * @param {string} ignoreEmptyLines
         * @return {string} the text for use in the address
         */
        buildAddressLines: function buildAddressLines(pattern, values, lineBreak, ignoreEmptyLines) {
            return addressFormatter.format(values, pattern, lineBreak, ignoreEmptyLines);
        },
    
    
        /**
         * Resolve the reference by tracing down the _ref value.
         * @param {*} data Address Format Data
         * @param {string} countryCode Country Code
         * @return {*} Referenced Address Format Data
         */
        followReferences: function followReferences(data$$1, countryCode) {
            if (data$$1[countryCode] && data$$1[countryCode]._ref) {
                return this.followReferences(data$$1, data$$1[countryCode]._ref);
            }
            return countryCode;
        },
    
    
        /**
         * Check strings for Han characters
         *
         * @param {...string} values String values to check against
         * @return {boolean} true if any of string values contain Han script character
         */
        containsHanScript: function containsHanScript() {
            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
                values[_key] = arguments[_key];
            }
    
            if (!values || !Array.isArray(values)) return false;
            return values.some(function (value) {
                if (!value) return false;
                // Javascript regex do not work with surrogate pairs so String#match is unusable with supplemental ranges.
                // Iterating a string returns a char that contains one codepoint.
                // Surrogate pairs will be returned as a pair.
                // Unicode block ranges: @see http://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;
    
                try {
                    for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var singleChar = _step.value;
    
                        var codePoint = singleChar.codePointAt(0); // Thank you ES2015
                        if (0x2E80 <= codePoint && codePoint <= 0x2EFF || // CJK Radicals Supplement
                        0x3300 <= codePoint && codePoint <= 0x33FF // CJK Compatibility
                        || 0xFE30 <= codePoint && codePoint <= 0xFE4F // CJK Compatibility Forms
                        || 0xF900 <= codePoint && codePoint <= 0xFAFF // CJK Compatibility Ideographs
                        || 0x2F800 <= codePoint && codePoint <= 0x2FA1F // CJK Compatibility Ideographs Supplement
                        || 0x3000 <= codePoint && codePoint <= 0x303F // CJK Symbols and Punctuation
                        || 0x4E00 <= codePoint && codePoint <= 0x9FFF // CJK Unified Ideographs
                        || 0x3400 <= codePoint && codePoint <= 0x4DBF // CJK Unified Ideographs Extension A
                        || 0x20000 <= codePoint && codePoint <= 0x2A6DF // CJK Unified Ideographs Extension B
                        || 0x2A700 <= codePoint && codePoint <= 0x2B73F // CJK Unified Ideographs Extension C
                        || 0x2B740 <= codePoint && codePoint <= 0x2B81F // CJK Unified Ideographs Extension D
                        || 0x2B820 <= codePoint && codePoint <= 0x2CEAF // CJK Unified Ideographs Extension E // Not on core
                        || 0x2CEB0 <= codePoint && codePoint <= 0x2EBEF // CJK Unified Ideographs Extension F // Not on core
                        || 0x3200 <= codePoint && codePoint <= 0x32FF // Enclosed CJK Letters and Months
                        || 0x31C0 <= codePoint && codePoint <= 0x31EF // CJK Strokes
    
                        // Chinese
                        || 0x3100 <= codePoint && codePoint <= 0x312F // Bopomofo
                        || 0x31A0 <= codePoint && codePoint <= 0x31BF // Bopomofo Extended
                        || 0x2F00 <= codePoint && codePoint <= 0x2FDF // Kangxi Radicals
                        || 0x2FF0 <= codePoint && codePoint <= 0x2FFF // Ideographic Description Characters
    
                        // Japanese
                        || 0xFF00 <= codePoint && codePoint <= 0xFFEF // Halfwidth and Fullwidth Forms
                        || 0x3040 <= codePoint && codePoint <= 0x309F // Hiragana
                        || 0x30A0 <= codePoint && codePoint <= 0x30FF // Katakana
                        || 0x31F0 <= codePoint && codePoint <= 0x31FF // Katakana Phonetic Extensions
                        || 0x1B000 <= codePoint && codePoint <= 0x1B0FF // Kana Supplement
                        || 0x1B100 <= codePoint && codePoint <= 0x1B12F // Kana Extended-A // Not on core
    
                        // Korean
                        || 0x1100 <= codePoint && codePoint <= 0x11FF // Hangul Jamo
                        || 0xAC00 <= codePoint && codePoint <= 0xD7AF // Hangul Syllables
                        || 0x3130 <= codePoint && codePoint <= 0x318F // Hangul Compatibility Jamo
                        || 0xA960 <= codePoint && codePoint <= 0xA97F // Hangul Jamo Extended-A
                        || 0xD7B0 <= codePoint && codePoint <= 0xD7FF // Hangul Jamo Extended-B
                        ) {
                                return true;
                            }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
    
                return false;
            });
        },
    
    
        /**
         * Returns the address code (country code) for given locale and data.
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @param {*} values Address Data
         * @return {string} Address Code
         */
        getCountryFromLocale: function getCountryFromLocale(langCode, countryCode, values) {
            if (values) {
                var isCJK = !countryCode && CJK_LANGUAGES.indexOf(langCode.toLowerCase()) >= 0 || countryCode && CJK_COUNTRIES.indexOf(countryCode.toUpperCase()) >= 0;
                var isJA = !countryCode && 'ja' == langCode.toLowerCase() || countryCode && 'JP' == countryCode.toUpperCase();
                // English format (ja_en_JP) is only used when all fields do not contain CJK characters
                if (!(isJA && this.containsHanScript(values.address, values.city, values.state, values.country)) && isCJK && !this.containsHanScript(values.address)) {
                    return this.getCountryFromLocale(langCode, 'EN_' + countryCode);
                }
            }
    
            var country = countryCode;
    
            // Address format should be always associated to a COUNTRY.
            // If country part is empty, we need to map language to a
            // certain country. For example, "de" -> "DE".
            if (!countryCode && languageCodeToCountry.languageCode[langCode]) {
                country = languageCodeToCountry.languageCode[langCode];
            }
    
            // Trace the real data from country reference.
            country = this.followReferences(data, country);
    
            if (!country || !data[country]) {
                return 'US'; // Always fall back to US format.
            }
    
            return country;
        },
    
    
        /**
         * Get fall back country code.
         *
         * @param {string} langCode Language Code
         * @param {string} countryCode Country Code
         * @param {*} address Address Data
         * @return {string} Address Code
         *
         * @deprecated Use getCountryFromLocale instead
         */
        getFallback: function getFallback(langCode, countryCode, address) {
            return this.getCountryFromLocale(langCode, countryCode);
        }
    };
    
    return address;
    
}
//# sourceMappingURL=AddressFormat.js.map
    