import debug from "debug";

import { SendRtcAnswer } from "../../../usecase/SendRtcAnswer";
import { MutationArguments, MutationResolver } from "./types";

interface SendRtcAnswerArguments {
  answer: string;
  recipientId: string;
}

interface SendRtcAnswerResult {
  success: boolean;
}

interface Dependencies {
  sendRtcAnswer: SendRtcAnswer;
}

const log = debug("app:resolver:SendRtcAnswerResolver");

export class SendRtcAnswerResolver
  implements
    MutationResolver<unknown, SendRtcAnswerArguments, SendRtcAnswerResult> {
  private readonly sendRtcAnswer: SendRtcAnswer;

  constructor({ sendRtcAnswer }: Dependencies) {
    this.sendRtcAnswer = sendRtcAnswer;
  }

  async resolve(
    obj: unknown,
    { args }: MutationArguments<SendRtcAnswerArguments>
  ): Promise<SendRtcAnswerResult> {
    log("resolve");

    await this.sendRtcAnswer.execute(args.answer, args.recipientId);

    return { success: true };
  }
}
