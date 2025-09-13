use anchor_lang::prelude::*;

declare_id!("FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ");

#[program]
pub mod asset_tokenization {
    use super::*;

    // Создание токенизированного актива
    pub fn create_asset(
        ctx: Context<CreateAsset>,
        asset_id: u64,
        metadata_uri: String,
        total_supply: u64,
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        asset.id = asset_id;
        asset.creator = ctx.accounts.creator.key();
        asset.metadata_uri = metadata_uri;
        asset.total_supply = total_supply;
        asset.remaining_supply = total_supply;
        asset.bump = ctx.bumps.asset;

        msg!("Asset created with ID: {}", asset_id);
        msg!("Creator: {}", asset.creator);
        msg!("Total supply: {}", total_supply);

        Ok(())
    }

    // Выпуск фракционных токенов
    pub fn mint_fraction_tokens(
        ctx: Context<MintFractionTokens>,
        amount: u64,
    ) -> Result<()> {
        require!(
            amount <= ctx.accounts.asset.remaining_supply,
            ErrorCode::InsufficientSupply
        );

        let asset = &mut ctx.accounts.asset;
        asset.remaining_supply -= amount;

        msg!("Minted {} fraction tokens", amount);
        msg!("Remaining supply: {}", asset.remaining_supply);

        Ok(())
    }

    // Покупка фракций
    pub fn buy_fractions(
        ctx: Context<BuyFractions>,
        amount: u64,
    ) -> Result<()> {
        require!(
            amount <= ctx.accounts.escrow.amount,
            ErrorCode::InsufficientTokenBalance
        );

        let escrow = &mut ctx.accounts.escrow;
        escrow.amount -= amount;

        msg!("Bought {} fraction tokens", amount);
        msg!("Remaining in escrow: {}", escrow.amount);

        Ok(())
    }

    // Распределение дохода
    pub fn distribute_revenue(
        ctx: Context<DistributeRevenue>,
        amount: u64,
    ) -> Result<()> {
        let revenue_pool = &mut ctx.accounts.revenue_pool;
        revenue_pool.total_revenue += amount;
        revenue_pool.distributed_revenue += amount;

        msg!("Distributed revenue: {}", amount);
        msg!("Total revenue: {}", revenue_pool.total_revenue);

        Ok(())
    }
}

// Структуры аккаунтов
#[derive(Accounts)]
#[instruction(asset_id: u64)]
pub struct CreateAsset<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 8 + 32 + 256 + 8 + 8 + 1,
        seeds = [b"asset", &asset_id.to_le_bytes()[..]],
        bump
    )]
    pub asset: Account<'info, Asset>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 8 + 1,
        seeds = [b"escrow", asset.key().as_ref()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 8 + 8 + 1,
        seeds = [b"revenue_pool", asset.key().as_ref()],
        bump
    )]
    pub revenue_pool: Account<'info, RevenuePool>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintFractionTokens<'info> {
    #[account(
        mut,
        seeds = [b"asset", &asset.id.to_le_bytes()],
        bump = asset.bump,
    )]
    pub asset: Account<'info, Asset>,
    
    #[account(
        mut,
        seeds = [b"escrow", asset.key().as_ref()],
        bump,
    )]
    pub escrow: Account<'info, Escrow>,
}

#[derive(Accounts)]
pub struct BuyFractions<'info> {
    #[account(
        mut,
        seeds = [b"asset", &asset.id.to_le_bytes()],
        bump = asset.bump,
    )]
    pub asset: Account<'info, Asset>,
    
    #[account(
        mut,
        seeds = [b"escrow", asset.key().as_ref()],
        bump = escrow.bump,
    )]
    pub escrow: Account<'info, Escrow>,
    
    pub buyer: Signer<'info>,
}

#[derive(Accounts)]
pub struct DistributeRevenue<'info> {
    #[account(
        mut,
        seeds = [b"revenue_pool", asset.key().as_ref()],
        bump = revenue_pool.bump,
    )]
    pub revenue_pool: Account<'info, RevenuePool>,
    
    #[account(
        seeds = [b"asset", &asset.id.to_le_bytes()],
        bump = asset.bump,
    )]
    pub asset: Account<'info, Asset>,
    
    pub creator: Signer<'info>,
}

// Структуры данных
#[account]
pub struct Asset {
    pub id: u64,
    pub creator: Pubkey,
    pub metadata_uri: String,
    pub total_supply: u64,
    pub remaining_supply: u64,
    pub bump: u8,
}

#[account]
pub struct Escrow {
    pub asset: Pubkey,
    pub amount: u64,
    pub bump: u8,
}

#[account]
pub struct RevenuePool {
    pub asset: Pubkey,
    pub total_revenue: u64,
    pub distributed_revenue: u64,
    pub bump: u8,
}

// Ошибки
#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient supply")]
    InsufficientSupply,
    #[msg("Insufficient token balance")]
    InsufficientTokenBalance,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Unauthorized")]
    Unauthorized,
}