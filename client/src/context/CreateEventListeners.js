import { ethers } from 'ethers';

import { ABI } from '../contract';

const AddNewEvent = (eventfilter, provider, eb) => {
    provider.removeListener(eventfilter); // not have multiple listeners for the same event

    provider.on(eventfilter, (logs) => {
        const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(logs);

        cb(parsedLog);
    })
}

export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert }) => {
    const NewPlayerEventFilter = contract.filters.NewPlayer();

    AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
        console.log('New Player Created!', args);
        if (walletAddress === args.owner) {
            setShowAlert({
                status: true,
                type: 'success',
                message: "Player has been successfully registered!"
            })
        }
    })
}