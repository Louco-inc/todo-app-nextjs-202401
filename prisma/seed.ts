import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Todoリストのインサート");
  await Promise.all(
    [
      {
        title: "プロジェクトプレゼン資料作成",
        description:
          "次回のプロジェクトプレゼンテーションのためにプレゼン資料を作成し、スライドやコンテンツを整理する。",
        completionDate: new Date("2024-01-15"),
      },
      {
        title: "週次ステータスミーティング参加",
        description:
          "チームメンバーと週次の進捗と課題を共有するために、ステータスミーティングに参加する。",
        completionDate: new Date("2024-01-20"),
      },
      {
        title: "顧客からの質問に回答",
        description:
          "顧客からのメールや問い合わせに対して、的確かつ迅速に回答する。",
        completionDate: new Date("2024-01-18"),
      },
      {
        title: "コードレビュー",
        description:
          "チームメンバーのコードをレビューし、フィードバックを提供する。品質の向上を図る。",
        completionDate: new Date("2024-01-25"),
      },
      {
        title: "新規機能の実装",
        description:
          "ユーザー要望に基づき、新しい機能をアプリケーションに実装する。デザインと機能を調整。",
        completionDate: new Date("2024-01-22"),
      },
      {
        title: "データベースの最適化",
        description:
          "アプリケーションのパフォーマンス向上のため、データベースクエリの最適化とインデックスの追加を行う。",
        completionDate: new Date("2024-01-16"),
      },
      {
        title: "テストケースの作成",
        description:
          "ユニットテストや統合テスト用のテストケースを作成し、アプリケーションの品質を確保する。",
        completionDate: new Date("2024-01-30"),
      },
      {
        title: "インターフェースの改善",
        description:
          "ユーザビリティ向上のために、アプリケーションのユーザーインターフェース（UI）を改善する。",
        completionDate: new Date("2024-02-10"),
      },
      {
        title: "セキュリティアップデートの適用",
        description:
          "最新の脆弱性情報を確認し、セキュリティアップデートをアプリケーションに適用する。",
        completionDate: new Date("2024-02-05"),
      },
      {
        title: "ドキュメンテーションの更新",
        description:
          "アプリケーションのコードや機能に対するドキュメンテーションを最新の状態に更新する。",
        completionDate: new Date("2024-02-01"),
      },
    ].map(async (todo) => {
      await prisma.todo.create({
        data: {
          title: todo.title,
          description: todo.description,
          completionDate: todo.completionDate,
          status: "todo",
        },
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
