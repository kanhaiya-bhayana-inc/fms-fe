import React, { useEffect, useState } from 'react'
import EditInfoIcon from '../InfoIconTooltip/EditInfoIcon'
import { fetchDelimiterOptions } from '../APIs/DropdownOptions/api'
// import { useInternalNotification, openNotificationWithIcon } from '../Notifications/notificationUtils';

export default function Testing() {
    const [delimiterData, setDelimiterData] = useState([]);
    // const { open } = useInternalNotification();  
       useEffect(() => {
        fetchDelimiterOptions()
            .then((data) => setDelimiterData(data))
            .catch((error) => console.error('error setting dropdown options:', error));
        }, []);
    //     const handleButtonClick = () => {
    //         const notificationData = openNotificationWithIcon('success', 'Success', 'This is a successful message.');
    // open(notificationData); // Display the notification
    //       };        console.log(delimiterData);
        return (
        <div className='container'>
            <EditInfoIcon />
            <form>
                <label>
                    Select an option:
                    <select>
                        {delimiterData.map((option) => (
                            <option key={option.name} value={option.name}>
                                {option.name} + " "{option.description}
                            </option>
                        ))}
                    </select>
                </label>
                {/* Other form elements */}
                {/* <button onClick={handleButtonClick}>Add</button> */}
            </form>

        </div>
    )
}
