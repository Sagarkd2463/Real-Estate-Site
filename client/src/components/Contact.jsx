import React, { useEffect, useState } from 'react';
const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing?.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchLandlord();
    }, [listing?.userRef]);

    const handleMessage = (e) => {
        setMessage(e.target.value);
    };

    const emailBody = encodeURIComponent(message);
    const mailtoLink = landlord
        ? `mailto:${landlord?.email}?subject=Regarding ${listing?.name}&body=${emailBody}`
        : '#';

    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>
                        Contact <span className="font-semibold">{landlord?.username}</span> for
                        <span className="font-semibold">{" " + listing?.name.toLowerCase()}</span>
                    </p>

                    <textarea
                        name="message"
                        id="message"
                        rows="2"
                        value={message}
                        placeholder="Enter your message here"
                        onChange={handleMessage}
                        className="w-full border p-3 rounded-lg"
                    ></textarea>

                    <a
                        href={mailtoLink}
                        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
                    >
                        Send Message
                    </a>
                </div>
            )}
        </>
    );
};

export default Contact;