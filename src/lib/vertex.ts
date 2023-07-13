import { env } from "@/env.mjs";
import axios from "axios";
import { GoogleAuth } from "google-auth-library";

const PROJECT_ID = "roadsmart-1412";

export const autoComplete = async (
  history: { user: string; text: string }[],
  output_user: string
) => {
  const auth = new GoogleAuth({
    keyFile: "src/google-key.json",
    credentials: {
      client_id: env.GOOGLE_CLIENT_ID,
      client_email: env.GOOGLE_CLIENT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY,
      token_url: env.GOOGLE_TOKEN_URL,
    },
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  const token = await auth.getAccessToken();
  const headers = {
    Authorization: `Bearer ${token as string}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    instances: [
      {
        prompt: `
        you are an ai embedded in an AI powered chat app. I will pass you a context of the 20 latest messages of the chat labelled by who said it, and you will give me options on how to appropriately respond in the next message, provide 3 options, each option delimited by a line break character so that i can parse the options easily.

example:

Elliott: yo are you coming to the dinner tnight?
Sithu: where and when?
Timothy: hmm i need to check with my parents
Elliott: we're going to holland village for some drinks
Timothy:

I'll check with them and let you know\n
Hmm I think i'll pass for tonight\n
Alright let's go! I love holland village\n

${history.map((h) => `${h.user}: ${h.text}`).join("\n")}
${output_user}:
        `,
      },
    ],
    parameters: {
      temperature: 1,
      maxOutputTokens: 256,
      topK: 40,
      topP: 0.95,
    },
  });

  try {
    const response = await axios.post(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/text-bison:predict`,
      body,
      {
        headers,
      }
    );

    if (response.status === 200) {
      const data = response.data as {
        predictions: {
          content: string;
        }[];
      };
      return data;
    } else {
      console.error(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};
