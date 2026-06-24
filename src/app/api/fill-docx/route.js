import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { createReport } from "docx-templates";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("first", data);

    const templatePath = path.resolve(`public/templates/${data.templateName}.docx`);
    const template = await readFile(templatePath);

    const buffer = await createReport({
      template,
      data,
      cmdDelimiter: ['+++', '+++'], // Required for +++= field +++ syntax
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Filled_Data_Sheet.docx"`,
      },
    });
  } catch (err) {
    console.error("Error generating DOCX:", err);
    return new NextResponse("Failed to generate document", { status: 500 });
  }
}
