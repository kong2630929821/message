import { UserType } from '../client/app/logic/autologin';
import { start } from './robot';

/**
 * 
 */

export const init = () => {

    setTimeout(() => {
        start(UserType.WALLET, getUri('openid'), getUri('sign'));
    }, 1000);
};

const getUri = (variable: string): string => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] === variable) { return pair[1]; }
    }

    return '';
};