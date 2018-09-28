import { test_db } from '../server/tests/db_test';
import { setTopic } from '../utils/net';

test_db();

setTopic("a/b/c");