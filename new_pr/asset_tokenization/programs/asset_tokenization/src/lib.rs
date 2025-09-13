use anchor_lang::prelude::*;

declare_id!("EABC6FncDMNntAh2BjCvFJLesTdfdcoyqTUhjLpeQoBE");

#[program]
pub mod asset_tokenization {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
