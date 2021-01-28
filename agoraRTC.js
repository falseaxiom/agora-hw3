let handlefail = function(err){
    console.log(err);
}

function addVideoStream(streamId){
    console.log();
    let remoteContainer = document.getElementById("otherVidsContainer");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.className = "remoteStream";
    streamDiv.style.transform = "rotateY(180deg)";
    remoteContainer.appendChild(streamDiv);
}

function addParticipant(streamId){
    console.log();
    let participantContainer = document.getElementById("participant-container");
    let participantDiv = document.createElement("div");
    participantDiv.className = "participant";
    participantDiv.id = streamId;
    participantDiv.innerHTML = streamId;
    participantContainer.appendChild(participantDiv);
}

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "dd95732445fa44c69531d808e34903b5";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    });

    client.init(
        appId,
        () => console.log("AgoraRTC Client Connected"),
        handlefail
    );

    client.join(
        null,
        channelName,
        Username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function(){
                localStream.play("SelfStream");
                console.log(`App id: ${appId}\nChannel id: ${channelName}`);
                client.publish(localStream);
            })

            addParticipant(Username);
        }
    );

    client.on("stream-added", function (evt){
        console.log("Added Stream");
        client.subscribe(evt.stream,handlefail);
    });

    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
        addParticipant(stream.getId());
    });
}