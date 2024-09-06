import { Account, Client, Databases, Query } from "appwrite";
import config from "../../config";

class Appwrite {
  client: Client;
  account: Account;
  databases: Databases;
  databaseId: string;
  adminCollectionId: string;
  itemsCollectionId: string;

  constructor() {
    this.client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(config.projectId);
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.databaseId = config.databaseId;
    this.adminCollectionId = config.adminCollectionId;
    this.itemsCollectionId = config.itemsCollectionId;
  }

  async login(email: string, password: string) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log(session);
      return session;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }

  async checkAdminPrivileges(userId: string): Promise<any> {
    try {
      const doc: any = await this.databases.listDocuments(
        this.databaseId,
        this.adminCollectionId,
        [Query.contains("userId", userId)]
      );
      const isAdmin: boolean = doc.documents[0].isAdmin;
      return isAdmin === true;
    } catch (error) {
      console.error("Failed to check admin privileges", error);
      return false;
    }
  }

  async uploadItem(name: string, price: number, imageFile: File) {
    try {
      // Upload the image to Appwrite storage (add your logic here if needed)
      const imageUploadResponse = await this.databases.createDocument(
        this.databaseId,
        this.itemsCollectionId,
        "unique_id", // You can replace with ID logic
        { name, price, imageFile: imageFile.name }
      );
      return imageUploadResponse;
    } catch (error) {
      console.error("Failed to upload item", error);
      throw error;
    }
  }
}

export const appwrite = new Appwrite();
