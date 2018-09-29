import { Logger } from '../../utils/logger';

export const test_logger = () => {
    let logger = new Logger("LOGGER_TEST", 0);
    logger.debug("logger test debug");
    logger.info("logger test info");
    logger.error("logger test error");
    logger.warn("logger test warn");
    logger.fatal("logger test fatal");
}
