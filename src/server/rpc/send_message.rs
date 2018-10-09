// TODO user id is String at present
struct sendMessage {
    src: String,
    dst: String,
    msgType: u8,
    msgId: usize,
    payload: String
}

struct messageReceivedAck {
    ack: bool
}

struct messageDeliveredAck {
    ack: bool
}
