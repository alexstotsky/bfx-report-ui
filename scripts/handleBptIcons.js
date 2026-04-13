/* Modifies icon path index files by removing data for all unused icons  */

const fs = require('fs')
const { IconNames } = require('@blueprintjs/icons')

const USED_ICONS = [
  IconNames.ADD_TO_FOLDER,
  IconNames.BOOK,
  IconNames.CALENDAR,
  IconNames.CARET_DOWN,
  IconNames.CARET_RIGHT,
  IconNames.CHART,
  IconNames.CHEVRON_LEFT,
  IconNames.CHEVRON_RIGHT,
  IconNames.CLOUD_DOWNLOAD,
  IconNames.CONFIRM,
  IconNames.CROSS,
  IconNames.EYE_OPEN,
  IconNames.DOLLAR,
  IconNames.DOUBLE_CARET_VERTICAL,
  IconNames.DOUBLE_CHEVRON_LEFT,
  IconNames.DOUBLE_CHEVRON_RIGHT,
  IconNames.EXCHANGE,
  IconNames.FLOWS,
  IconNames.FOLDER_SHARED_OPEN,
  IconNames.HELP,
  IconNames.HISTORY,
  IconNames.ISSUE_NEW,
  IconNames.LOCATE,
  IconNames.KEY,
  IconNames.LIST_COLUMNS,
  IconNames.LOG_IN,
  IconNames.MENU,
  IconNames.NUMBERED_LIST,
  IconNames.PERSON,
  IconNames.PROPERTY,
  IconNames.PULSE,
  IconNames.REFRESH,
  IconNames.SEARCH,
  IconNames.SERIES_DERIVED,
  IconNames.SMALL_CROSS,
  IconNames.TH_FILTERED,
  IconNames.TIMELINE_BAR_CHART,
  IconNames.UPDATED,
]

const toPascalCase = str => str
  .split('-')
  .map(s => s.charAt(0).toUpperCase() + s.slice(1))
  .join('')

const generatePathsIndex = (size) => {
  const lines = USED_ICONS
    .map(name => `export { default as ${toPascalCase(name)} } from "./${name}";`)
    .join('\n')

  const filePath = `./node_modules/@blueprintjs/icons/lib/esm/generated/${size}px/paths/index.js`
  fs.writeFileSync(filePath, `${lines}\n`)
}

generatePathsIndex(16)
generatePathsIndex(20)
