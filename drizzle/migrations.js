// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_spooky_killmonger.sql';
import m0001 from './0001_closed_rick_jones.sql';
import m0002 from './0002_freezing_zaladane.sql';
import m0003 from './0003_strange_luckman.sql';
import m0004 from './0004_aromatic_karnak.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  