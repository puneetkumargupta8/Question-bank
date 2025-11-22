console.log('Starting debug...');
try { require('express'); console.log('express ok'); } catch (e) { console.log('express failed'); }
try { require('cors'); console.log('cors ok'); } catch (e) { console.log('cors failed'); }
try { require('dotenv'); console.log('dotenv ok'); } catch (e) { console.log('dotenv failed'); }
try { require('@prisma/client'); console.log('prisma ok'); } catch (e) { console.log('prisma failed'); }
