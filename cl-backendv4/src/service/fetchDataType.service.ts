/**
 * This service is responsible for fetching data from Call Transcript from the S3 bucket.
 */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  ListObjectsV2Output,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { isDev } from "../utils/environment";
import prisma from "../prisma";
import { getAWSCredentials, getAWSS3Config, retryWithExponentialBackoff } from "../utils/aws-credentials";
// import { GetSignedUrlForAudio } from "./getCallLogs.service";

interface CustomerMetadata {
  ContactId: string;
  InputS3Uri?: string;
}

interface TranscriptItem {
  ParticipantId: string;
  Content: string;
}

interface FileContent {
  CustomerMetadata: CustomerMetadata;
  Transcript?: TranscriptItem[];
}

const BUCKET_NAME = "amazon-connect-call-recordings-caller-dashboard";

// Initialize S3 client with our utility function
const s3Client = new S3Client(getAWSS3Config());

const prepareTranscript = (data: TranscriptItem[]): string =>
  JSON.stringify(
    data.map((item) => ({
      speaker: item.ParticipantId,
      text: item.Content,
    }))
  );

export const FetchDataTypeService = async (
  mode?: "recording" | "transcript"
): Promise<{ response: string }> => {
  try {
    // Use retry mechanism for AWS operations
    const result = await retryWithExponentialBackoff(async () => {
      const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        MaxKeys: 10,
      });

      const response = await s3Client.send(command);
      return response;
    });

    if (!result.Contents || result.Contents.length === 0) {
      return { response: "No files found in the bucket" };
    }

    // Find the first JSON file (transcript)
    const jsonFile = result.Contents.find((file) =>
      file.Key?.endsWith(".json")
    );

    if (!jsonFile || !jsonFile.Key) {
      return { response: "No transcript files found" };
    }

    // Use retry mechanism for AWS operations
    const fileData = await retryWithExponentialBackoff(async () => {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: jsonFile.Key,
      });

      const response = await s3Client.send(command);
      const bodyContents = await response.Body?.transformToString();
      return bodyContents;
    });

    if (!fileData) {
      return { response: "Failed to read file contents" };
    }

    const parsedData: FileContent = JSON.parse(fileData);

    if (mode === "recording" && parsedData.CustomerMetadata.InputS3Uri) {
      return { response: parsedData.CustomerMetadata.InputS3Uri };
    }

    if (
      mode === "transcript" &&
      parsedData.Transcript &&
      parsedData.Transcript.length > 0
    ) {
      return { response: prepareTranscript(parsedData.Transcript) };
    }

    // Default response
    return {
      response: `Contact ID: ${parsedData.CustomerMetadata.ContactId}`,
    };
  } catch (error: any) {
    console.error("Error fetching data from S3:", error);
    return { response: `Error: ${error.message || "Unknown error"}` };
  }
};
