"use client";

import "../../styles/Chat.css"
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import NavigationControl from '../ui/NavigationControl'
import LoadChat from '../ui/LoadChat'
import Loading from '../states/Loading';
import Error from '../states/Error';

import { getGlobalMessage, sendGlobalMessage } from '../../services/chatApi'
import { useAuth } from '../../context/AuthContext'
import { socket } from "../../hooks/socket";

function GlobalChat() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [message, setMessage] = useState("")

    const chatMutation = useMutation({
        mutationFn: sendGlobalMessage,
        onMutate: async ({ message }) => {
            await queryClient.cancelQueries({ queryKey: ["global-chat"] });

            const previous = queryClient.getQueryData(["global-chat"]);

            queryClient.setQueryData(["global-chat"], (old) => ({
                ...old,
                messages: [
                    {
                        _id: `temp-${Date.now()}`,
                        message,
                        user,
                        createdAt: new Date().toISOString(),
                        optimistic: true,
                    },
                    ...(old?.messages || []),
                ],
            }));

            return { previous };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(["global-chat"], context.previous);
        },
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ["global-chat"],
        queryFn: getGlobalMessage,
        enabled: user !== null,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

    useEffect(() => {
        const handler = (message) => {
            queryClient.setQueryData(["global-chat"], (old) => {
                if (!old) return old;

                // remove optimistic version if it exists
                const filtered = old.messages.filter(
                    (m) => !m.optimistic
                );

                return {
                    ...old,
                    messages: [message, ...filtered],
                };
            });
        };

        socket.on("newMessage", handler);

        return () => socket.off("newMessage", handler);
    }, [queryClient]);

    const messages = data?.messages ?? []

    const submitHandler = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        chatMutation.mutate({
            message
        })
        setMessage("")
    };

    if (isLoading) return <Loading />
    if (error) return <Error error={error} />
    return (
        <div className="chat">
            <div className="chatContainer">
                <div className="GlobalMessages" >
                    <form className="chatForm" onSubmit={submitHandler} >
                        <div className="chatFormContainer">
                            <input className='chatInput' value={message} type="text" placeholder='Type' onChange={(e) => setMessage(e.target.value)} />
                            <button className='chatSendBtn' type='submit'><i className="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </form>
                    {!isLoading && messages?.map((m, i) => <LoadChat key={m._id} data={m} user={user} />)}
                    <div className="chatHead">
                        <NavigationControl styles="goBack" />
                        <h3>Global Chat</h3>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default GlobalChat