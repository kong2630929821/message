import { test_db } from './db_test';
import { test_logger } from './logger_test';
import { setTopic } from '../../utils/net';

export const testAll = () => {
    test_db();
    test_logger();

    setTopic("a/b/c");
}