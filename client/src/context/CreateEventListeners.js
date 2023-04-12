import { ethers } from 'ethers';

import { ABI } from '../contract';

const AddNewEvent = (eventfilter, provider, cb) => {
    provider.removeListener(eventfilter); // not have multiple listeners for the same event

    provider.on(eventfilter, (logs) => {
        const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(logs);

        cb(parsedLog);
    })
}

export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData }) => {
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


    // join game

    const NewBattleEventFilter = contract.filters.NewBattle();
    AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
        // navigate both players to the battle page
        console.log('New Battle Created!', args, walletAddress);

        if (walletAddress.toLowerCase() === args.player1.toLowerCase() || walletAddress.toLowerCase() === args.player2.toLowerCase()) {
            navigate(`/battle/${args.battleName}`)
        }
        setUpdateGameData((prevupdateGameData) => prevupdateGameData + 1);
    });
}