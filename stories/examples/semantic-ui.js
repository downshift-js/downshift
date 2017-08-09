import React from 'react'
import matchSorter from 'match-sorter'
import glamorous, {Div} from 'glamorous'

import Autocomplete from '../../src'

const items = getCountries()

export default Examples

function Examples() {
  return (
    <div>
      <Div
        css={{
          margin: '50px auto',
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <Div display="flex" justifyContent="center">
          <SemanticUIAutocomplete />
        </Div>
      </Div>
    </div>
  )
}

const Item = glamorous.div(
  {
    position: 'relative',
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({isActive, isSelected}) => {
    const styles = []
    if (isActive) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        background: 'rgba(0,0,0,.03)',
      })
    }
    if (isSelected) {
      styles.push({
        color: 'rgba(0,0,0,.95)',
        fontWeight: '700',
      })
    }
    return styles
  },
)
const onAttention = '&:hover, &:focus'
const Input = glamorous.input(
  {
    width: 'calc(100% - 16px)', // full width - icon width/2 - border
    fontSize: 14,
    wordWrap: 'break-word',
    lineHeight: '1em',
    outline: 0,
    whiteSpace: 'normal',
    minHeight: '2em',
    background: '#fff',
    display: 'inline-block',
    padding: '.5em 2em .5em 1em',
    color: 'rgba(0,0,0,.87)',
    boxShadow: 'none',
    border: '1px solid rgba(34,36,38,.15)',
    borderRadius: '.30rem',
    transition: 'box-shadow .1s ease,width .1s ease',
    ':hover': {
      borderColor: 'rgba(34,36,38,.35)',
      boxShadow: 'none',
    },
    [onAttention]: {
      borderColor: '#96c8da',
      boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    },
  },
  ({isOpen}) =>
    isOpen
      ? {
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
        }
      : null,
)

const Menu = glamorous.div({
  maxHeight: '20rem',
  overflowY: 'auto',
  overflowX: 'hidden',
  borderTopWidth: '0',
  outline: '0',
  borderRadius: '0 0 .28571429rem .28571429rem',
  transition: 'opacity .1s ease',
  boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
  borderColor: '#96c8da',
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderStyle: 'solid',
})

const ControlButton = glamorous.button({
  backgroundColor: 'transparent',
  border: 'none',
  position: 'absolute',
  right: 8,
  top: 12,
  cursor: 'pointer',
})

function advancedFilter(theItems, value) {
  return matchSorter(theItems, value, {
    keys: ['name', 'code'],
  })
}

function SemanticUIAutocomplete() {
  return (
    <Autocomplete
      itemToString={i => (i ? i.name : '')}
      style={{
        width: '250px',
      }}
    >
      {({
        highlightedIndex,
        isOpen,
        toggleMenu,
        clearSelection,
        getRootProps,
        inputValue,
        selectedItem,
        getButtonProps,
        getInputProps,
        getItemProps,
      }) =>
        (<Div {...getRootProps({refKey: 'innerRef'})}>
          <Div position="relative" css={{paddingRight: '1.75em'}}>
            <Input
              {...getInputProps({
                isOpen,
                placeholder: 'Enter some info',
              })}
            />
            {selectedItem
              ? <ControlButton
                css={{paddingTop: 4}}
                onClick={clearSelection}
                aria-label="clear selection"
                >
                <XIcon />
              </ControlButton>
              : <ControlButton {...getButtonProps()}>
                <ArrowIcon isOpen={isOpen} />
              </ControlButton>}
          </Div>
          {isOpen &&
            <Menu>
              {(inputValue
                ? advancedFilter(items, inputValue)
                : items).map((item, index) =>
                  (<Item
                    key={item.code}
                    {...getItemProps({
                    item,
                    index,
                    isActive: highlightedIndex === index,
                    isSelected: selectedItem === item,
                  })}
                >
                    {item.name}
                  </Item>),
              )}
            </Menu>}
        </Div>)}
    </Autocomplete>
  )
}

function ArrowIcon({isOpen}) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : null}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  )
}

function getCountries() {
  return [
    {code: 'af', name: 'Afghanistan'},
    {code: 'ax', name: 'Aland Islands'},
    {code: 'al', name: 'Albania'},
    {code: 'dz', name: 'Algeria'},
    {code: 'as', name: 'American Samoa'},
    {code: 'ad', name: 'Andorra'},
    {code: 'ao', name: 'Angola'},
    {code: 'ai', name: 'Anguilla'},
    {code: 'ag', name: 'Antigua'},
    {code: 'ar', name: 'Argentina'},
    {code: 'am', name: 'Armenia'},
    {code: 'aw', name: 'Aruba'},
    {code: 'au', name: 'Australia'},
    {code: 'at', name: 'Austria'},
    {code: 'az', name: 'Azerbaijan'},
    {code: 'bs', name: 'Bahamas'},
    {code: 'bh', name: 'Bahrain'},
    {code: 'bd', name: 'Bangladesh'},
    {code: 'bb', name: 'Barbados'},
    {code: 'by', name: 'Belarus'},
    {code: 'be', name: 'Belgium'},
    {code: 'bz', name: 'Belize'},
    {code: 'bj', name: 'Benin'},
    {code: 'bm', name: 'Bermuda'},
    {code: 'bt', name: 'Bhutan'},
    {code: 'bo', name: 'Bolivia'},
    {code: 'ba', name: 'Bosnia'},
    {code: 'bw', name: 'Botswana'},
    {code: 'bv', name: 'Bouvet Island'},
    {code: 'br', name: 'Brazil'},
    {code: 'vg', name: 'British Virgin Islands'},
    {code: 'bn', name: 'Brunei'},
    {code: 'bg', name: 'Bulgaria'},
    {code: 'bf', name: 'Burkina Faso'},
    {code: 'mm', name: 'Burma'},
    {code: 'bi', name: 'Burundi'},
    {code: 'tc', name: 'Caicos Islands'},
    {code: 'kh', name: 'Cambodia'},
    {code: 'cm', name: 'Cameroon'},
    {code: 'ca', name: 'Canada'},
    {code: 'cv', name: 'Cape Verde'},
    {code: 'ky', name: 'Cayman Islands'},
    {code: 'cf', name: 'Central African Republic'},
    {code: 'td', name: 'Chad'},
    {code: 'cl', name: 'Chile'},
    {code: 'cn', name: 'China'},
    {code: 'cx', name: 'Christmas Island'},
    {code: 'cc', name: 'Cocos Islands'},
    {code: 'co', name: 'Colombia'},
    {code: 'km', name: 'Comoros'},
    {code: 'cg', name: 'Congo Brazzaville'},
    {code: 'cd', name: 'Congo'},
    {code: 'ck', name: 'Cook Islands'},
    {code: 'cr', name: 'Costa Rica'},
    {code: 'ci', name: 'Cote Divoire'},
    {code: 'hr', name: 'Croatia'},
    {code: 'cu', name: 'Cuba'},
    {code: 'cy', name: 'Cyprus'},
    {code: 'cz', name: 'Czech Republic'},
    {code: 'dk', name: 'Denmark'},
    {code: 'dj', name: 'Djibouti'},
    {code: 'dm', name: 'Dominica'},
    {code: 'do', name: 'Dominican Republic'},
    {code: 'ec', name: 'Ecuador'},
    {code: 'eg', name: 'Egypt'},
    {code: 'sv', name: 'El Salvador'},
    {code: 'gb', name: 'England'},
    {code: 'gq', name: 'Equatorial Guinea'},
    {code: 'er', name: 'Eritrea'},
    {code: 'ee', name: 'Estonia'},
    {code: 'et', name: 'Ethiopia'},
    {code: 'eu', name: 'European Union'},
    {code: 'fk', name: 'Falkland Islands'},
    {code: 'fo', name: 'Faroe Islands'},
    {code: 'fj', name: 'Fiji'},
    {code: 'fi', name: 'Finland'},
    {code: 'fr', name: 'France'},
    {code: 'gf', name: 'French Guiana'},
    {code: 'pf', name: 'French Polynesia'},
    {code: 'tf', name: 'French Territories'},
    {code: 'ga', name: 'Gabon'},
    {code: 'gm', name: 'Gambia'},
    {code: 'ge', name: 'Georgia'},
    {code: 'de', name: 'Germany'},
    {code: 'gh', name: 'Ghana'},
    {code: 'gi', name: 'Gibraltar'},
    {code: 'gr', name: 'Greece'},
    {code: 'gl', name: 'Greenland'},
    {code: 'gd', name: 'Grenada'},
    {code: 'gp', name: 'Guadeloupe'},
    {code: 'gu', name: 'Guam'},
    {code: 'gt', name: 'Guatemala'},
    {code: 'gw', name: 'Guinea-Bissau'},
    {code: 'gn', name: 'Guinea'},
    {code: 'gy', name: 'Guyana'},
    {code: 'ht', name: 'Haiti'},
    {code: 'hm', name: 'Heard Island'},
    {code: 'hn', name: 'Honduras'},
    {code: 'hk', name: 'Hong Kong'},
    {code: 'hu', name: 'Hungary'},
    {code: 'is', name: 'Iceland'},
    {code: 'in', name: 'India'},
    {code: 'io', name: 'Indian Ocean Territory'},
    {code: 'id', name: 'Indonesia'},
    {code: 'ir', name: 'Iran'},
    {code: 'iq', name: 'Iraq'},
    {code: 'ie', name: 'Ireland'},
    {code: 'il', name: 'Israel'},
    {code: 'it', name: 'Italy'},
    {code: 'jm', name: 'Jamaica'},
    {code: 'jp', name: 'Japan'},
    {code: 'jo', name: 'Jordan'},
    {code: 'kz', name: 'Kazakhstan'},
    {code: 'ke', name: 'Kenya'},
    {code: 'ki', name: 'Kiribati'},
    {code: 'kw', name: 'Kuwait'},
    {code: 'kg', name: 'Kyrgyzstan'},
    {code: 'la', name: 'Laos'},
    {code: 'lv', name: 'Latvia'},
    {code: 'lb', name: 'Lebanon'},
    {code: 'ls', name: 'Lesotho'},
    {code: 'lr', name: 'Liberia'},
    {code: 'ly', name: 'Libya'},
    {code: 'li', name: 'Liechtenstein'},
    {code: 'lt', name: 'Lithuania'},
    {code: 'lu', name: 'Luxembourg'},
    {code: 'mo', name: 'Macau'},
    {code: 'mk', name: 'Macedonia'},
    {code: 'mg', name: 'Madagascar'},
    {code: 'mw', name: 'Malawi'},
    {code: 'my', name: 'Malaysia'},
    {code: 'mv', name: 'Maldives'},
    {code: 'ml', name: 'Mali'},
    {code: 'mt', name: 'Malta'},
    {code: 'mh', name: 'Marshall Islands'},
    {code: 'mq', name: 'Martinique'},
    {code: 'mr', name: 'Mauritania'},
    {code: 'mu', name: 'Mauritius'},
    {code: 'yt', name: 'Mayotte'},
    {code: 'mx', name: 'Mexico'},
    {code: 'fm', name: 'Micronesia'},
    {code: 'md', name: 'Moldova'},
    {code: 'mc', name: 'Monaco'},
    {code: 'mn', name: 'Mongolia'},
    {code: 'me', name: 'Montenegro'},
    {code: 'ms', name: 'Montserrat'},
    {code: 'ma', name: 'Morocco'},
    {code: 'mz', name: 'Mozambique'},
    {code: 'na', name: 'Namibia'},
    {code: 'nr', name: 'Nauru'},
    {code: 'np', name: 'Nepal'},
    {code: 'an', name: 'Netherlands Antilles'},
    {code: 'nl', name: 'Netherlands'},
    {code: 'nc', name: 'New Caledonia'},
    {code: 'pg', name: 'New Guinea'},
    {code: 'nz', name: 'New Zealand'},
    {code: 'ni', name: 'Nicaragua'},
    {code: 'ne', name: 'Niger'},
    {code: 'ng', name: 'Nigeria'},
    {code: 'nu', name: 'Niue'},
    {code: 'nf', name: 'Norfolk Island'},
    {code: 'kp', name: 'North Korea'},
    {code: 'mp', name: 'Northern Mariana Islands'},
    {code: 'no', name: 'Norway'},
    {code: 'om', name: 'Oman'},
    {code: 'pk', name: 'Pakistan'},
    {code: 'pw', name: 'Palau'},
    {code: 'ps', name: 'Palestine'},
    {code: 'pa', name: 'Panama'},
    {code: 'py', name: 'Paraguay'},
    {code: 'pe', name: 'Peru'},
    {code: 'ph', name: 'Philippines'},
    {code: 'pn', name: 'Pitcairn Islands'},
    {code: 'pl', name: 'Poland'},
    {code: 'pt', name: 'Portugal'},
    {code: 'pr', name: 'Puerto Rico'},
    {code: 'qa', name: 'Qatar'},
    {code: 're', name: 'Reunion'},
    {code: 'ro', name: 'Romania'},
    {code: 'ru', name: 'Russia'},
    {code: 'rw', name: 'Rwanda'},
    {code: 'sh', name: 'Saint Helena'},
    {code: 'kn', name: 'Saint Kitts and Nevis'},
    {code: 'lc', name: 'Saint Lucia'},
    {code: 'pm', name: 'Saint Pierre'},
    {code: 'vc', name: 'Saint Vincent'},
    {code: 'ws', name: 'Samoa'},
    {code: 'sm', name: 'San Marino'},
    {code: 'gs', name: 'Sandwich Islands'},
    {code: 'st', name: 'Sao Tome'},
    {code: 'sa', name: 'Saudi Arabia'},
    {code: 'sn', name: 'Senegal'},
    {code: 'cs', name: 'Serbia'},
    {code: 'rs', name: 'Serbia'},
    {code: 'sc', name: 'Seychelles'},
    {code: 'sl', name: 'Sierra Leone'},
    {code: 'sg', name: 'Singapore'},
    {code: 'sk', name: 'Slovakia'},
    {code: 'si', name: 'Slovenia'},
    {code: 'sb', name: 'Solomon Islands'},
    {code: 'so', name: 'Somalia'},
    {code: 'za', name: 'South Africa'},
    {code: 'kr', name: 'South Korea'},
    {code: 'es', name: 'Spain'},
    {code: 'lk', name: 'Sri Lanka'},
    {code: 'sd', name: 'Sudan'},
    {code: 'sr', name: 'Suriname'},
    {code: 'sj', name: 'Svalbard'},
    {code: 'sz', name: 'Swaziland'},
    {code: 'se', name: 'Sweden'},
    {code: 'ch', name: 'Switzerland'},
    {code: 'sy', name: 'Syria'},
    {code: 'tw', name: 'Taiwan'},
    {code: 'tj', name: 'Tajikistan'},
    {code: 'tz', name: 'Tanzania'},
    {code: 'th', name: 'Thailand'},
    {code: 'tl', name: 'Timorleste'},
    {code: 'tg', name: 'Togo'},
    {code: 'tk', name: 'Tokelau'},
    {code: 'to', name: 'Tonga'},
    {code: 'tt', name: 'Trinidad'},
    {code: 'tn', name: 'Tunisia'},
    {code: 'tr', name: 'Turkey'},
    {code: 'tm', name: 'Turkmenistan'},
    {code: 'tv', name: 'Tuvalu'},
    {code: 'ug', name: 'Uganda'},
    {code: 'ua', name: 'Ukraine'},
    {code: 'ae', name: 'United Arab Emirates'},
    {code: 'us', name: 'United States'},
    {code: 'uy', name: 'Uruguay'},
    {code: 'um', name: 'Us Minor Islands'},
    {code: 'vi', name: 'Us Virgin Islands'},
    {code: 'uz', name: 'Uzbekistan'},
    {code: 'vu', name: 'Vanuatu'},
    {code: 'va', name: 'Vatican City'},
    {code: 've', name: 'Venezuela'},
    {code: 'vn', name: 'Vietnam'},
    {code: 'wf', name: 'Wallis and Futuna'},
    {code: 'eh', name: 'Western Sahara'},
    {code: 'ye', name: 'Yemen'},
    {code: 'zm', name: 'Zambia'},
    {code: 'zw', name: 'Zimbabwe'},
  ]
}
